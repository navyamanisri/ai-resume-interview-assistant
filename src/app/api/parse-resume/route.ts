import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}

export async function POST(req: NextRequest) {
  try {
    // Get uploaded file
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract PDF text
    let resumeText = "";
    try {
      resumeText = await extractTextFromPDF(buffer);
    } catch (pdfErr) {
      console.error("PDF parse error:", pdfErr);
      return NextResponse.json(
        {
          error: `PDF error: ${
            pdfErr instanceof Error ? pdfErr.message : "Unknown PDF error"
          }`,
        },
        { status: 422 }
      );
    }

    // Validate extracted text
    if (!resumeText || resumeText.length < 30) {
      return NextResponse.json(
        {
          error: "Could not extract text from this PDF. Please upload a text-based resume PDF.",
        },
        { status: 422 }
      );
    }

    // Check for Custom API Key in headers, or fall back to Env variable
    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google API Key is missing. Please set it in your system or provide a custom key in Settings." },
        { status: 500 }
      );
    }

    // Build prompt for structured JSON output
    const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume text. You must return a JSON object with the exact keys:
- "atsScore": a number between 0 and 100 representing the overall ATS match rating.
- "summary": a concise 3-4 sentence professional summary highlighting the candidate's core expertise.
- "strengths": an array of 3 key professional strengths found in the resume.
- "weaknesses": an array of 3 areas of improvement or gaps in the resume.
- "tips": an array of 3 actionable ATS/formatting improvement tips.
- "questions": an array of 5 customized interview questions based on the candidate's experience.

Resume Text:
${resumeText.slice(0, 8000)}
`;

    // Call Gemini API using the official SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      return NextResponse.json(
        { error: "Empty response received from AI model." },
        { status: 502 }
      );
    }

    // Parse the structured output
    try {
      const parsedAnalysis = JSON.parse(responseText);
      
      // Basic structure validation
      if (typeof parsedAnalysis.atsScore !== "number" || !parsedAnalysis.summary) {
        throw new Error("Invalid structure returned by AI model.");
      }

      return NextResponse.json(parsedAnalysis);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", responseText, parseErr);
      return NextResponse.json(
        { error: "AI model failed to return a valid JSON analysis. Please try again." },
        { status: 502 }
      );
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("Route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
