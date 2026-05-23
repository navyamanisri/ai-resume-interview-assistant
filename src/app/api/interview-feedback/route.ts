import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, resumeSummary } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 }
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

    // Build prompt for structured JSON feedback
    const prompt = `
You are an expert technical interviewer and career coach.

Evaluate the candidate's answer to the following interview question.
${resumeSummary ? `Use this candidate summary for context: "${resumeSummary}"` : ""}

Interview Question:
"${question}"

Candidate's Answer:
"${answer}"

Analyze the response and return a JSON object with the exact keys:
- "score": a number between 0 and 100 rating the quality, completeness, and delivery of the answer.
- "feedback": detailed, constructive bulleted feedback highlighting what was good and what could be improved.
- "betterAnswer": a polished, high-impact version of how the candidate should answer this question, using industry-standard frameworks (like STAR: Situation, Task, Action, Result) if applicable.

Return ONLY the JSON object.
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

    try {
      const parsedFeedback = JSON.parse(responseText);
      
      // Basic structure validation
      if (typeof parsedFeedback.score !== "number" || !parsedFeedback.feedback || !parsedFeedback.betterAnswer) {
        throw new Error("Invalid structure returned by AI model.");
      }

      return NextResponse.json(parsedFeedback);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", responseText, parseErr);
      return NextResponse.json(
        { error: "AI model failed to return valid JSON feedback. Please try again." },
        { status: 502 }
      );
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("Feedback route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
