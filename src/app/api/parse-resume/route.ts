import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

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
        { status: 422 },
      );
    }

    // Validate extracted text
    if (!resumeText || resumeText.length < 30) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. Please use a text-based PDF.",
        },
        { status: 422 },
      );
    }

    // Get Gemini API key
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY missing" },
        { status: 500 },
      );
    }

    // Build prompt
    const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze this resume professionally.

Return:
1. ATS Score
2. Resume Summary
3. Strengths
4. Weaknesses
5. ATS Improvement Tips
6. Interview Questions

Resume:
${resumeText.slice(0, 4000)}
`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    console.log("Gemini status:", geminiResponse.status);

    const rawResponse = await geminiResponse.text();

    console.log("Gemini raw response:", rawResponse);

    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          error: `Gemini API failed: ${rawResponse}`,
        },
        { status: 502 },
      );
    }

    const geminiData = JSON.parse(rawResponse);

    const analysisText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      return NextResponse.json(
        { error: "Empty Gemini response." },
        { status: 502 },
      );
    }

    // Return result
    return NextResponse.json({
      text: analysisText,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";

    console.error("Route error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
