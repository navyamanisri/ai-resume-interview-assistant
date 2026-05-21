"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a resume PDF.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("RESOURCE_EXHAUSTED")) {
          setError("AI quota temporarily exceeded. Please try again later.");
        } else {
          setError(data.error || "Something went wrong.");
        }

        return;
      }

      setResult(data.text);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-sm tracking-[0.2em] uppercase text-zinc-500 mb-4">
            AI Powered Career Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            AI Resume Interview Assistant
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-2xl">
            Upload your resume to receive ATS analysis, resume improvement
            suggestions, and AI-powered interview preparation insights.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Upload Resume (PDF)
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-zinc-300
                file:mr-4 file:py-3 file:px-5
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-white file:text-black
                hover:file:bg-zinc-200"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                loading
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-5 rounded-2xl">
                {error}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Resume Analysis</h2>

            <div className="whitespace-pre-wrap leading-8 text-zinc-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
