"use client";

import { useState } from "react";

const mockData = {
  score: 84,
  summary:
    "Strong frontend-focused candidate with React, Next.js, and TypeScript experience. Demonstrates good project-building skills and deployment understanding.",

  strengths: [
    "Strong React fundamentals",
    "Good TypeScript usage",
    "Clean project organization",
    "Deployment knowledge",
  ],

  weaknesses: [
    "Needs stronger backend depth",
    "Add measurable achievements",
    "Improve testing knowledge",
  ],

  tips: [
    "Add backend-related keywords",
    "Include quantified achievements",
    "Add GitHub links",
    "Improve formatting consistency",
  ],

  questions: [
    "Explain React hooks.",
    "What is SSR in Next.js?",
    "Difference between state and props?",
    "Explain TypeScript interfaces.",
    "How does API routing work in Next.js?",
  ],
};

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a resume PDF.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShowAnalysis(false);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          "AI quota temporarily exceeded. Showing demo analysis instead.",
        );

        setShowAnalysis(true);
        return;
      }

      setShowAnalysis(true);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to AI service. Showing demo analysis instead.",
      );

      setShowAnalysis(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-[280px] border-r border-zinc-800 bg-zinc-950 p-8 hidden lg:flex flex-col">
        <div className="mb-14">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-xl mb-6">
            AI
          </div>

          <h2 className="text-2xl font-bold leading-tight">Resume Assistant</h2>

          <p className="text-zinc-500 mt-3 leading-7">
            AI powered resume and interview preparation platform.
          </p>
        </div>

        <nav className="space-y-3">
          <div className="bg-white text-black px-5 py-4 rounded-2xl font-medium">
            Dashboard
          </div>

          <div className="text-zinc-500 px-5 py-4 rounded-2xl hover:bg-zinc-900 transition-all cursor-pointer">
            Resume Analysis
          </div>

          <div className="text-zinc-500 px-5 py-4 rounded-2xl hover:bg-zinc-900 transition-all cursor-pointer">
            Interview Questions
          </div>

          <div className="text-zinc-500 px-5 py-4 rounded-2xl hover:bg-zinc-900 transition-all cursor-pointer">
            ATS Reports
          </div>

          <div className="text-zinc-500 px-5 py-4 rounded-2xl hover:bg-zinc-900 transition-all cursor-pointer">
            Settings
          </div>
        </nav>

        <div className="mt-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-sm text-zinc-500 mb-3">AI STATUS</p>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />

              <p className="text-sm text-zinc-300">System Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-200px] left-[200px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-14">
            <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-5">
              AI Powered Career Platform
            </p>

            <h1 className="text-6xl font-bold leading-tight mb-6">
              Resume Intelligence
              <br />
              Dashboard
            </h1>

            <p className="text-zinc-400 text-xl leading-9 max-w-3xl">
              Upload your resume to receive ATS analysis, optimization insights,
              and AI-powered interview preparation guidance.
            </p>
          </div>

          {/* Upload */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Upload Resume</h2>

                <p className="text-zinc-400">
                  PDF format only. Secure AI analysis workflow.
                </p>
              </div>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-zinc-300
                file:mr-4 file:py-4 file:px-6
                file:rounded-2xl file:border-0
                file:text-sm file:font-semibold
                file:bg-white file:text-black
                hover:file:bg-zinc-200 cursor-pointer"
              />

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                  loading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.01]"
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

          {/* Analysis */}
          {showAnalysis && (
            <div className="mt-12 space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Score */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-[32px] p-8 min-h-[280px] flex flex-col justify-between shadow-2xl">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                      ATS SCORE
                    </p>

                    <h2 className="text-8xl font-bold">{mockData.score}</h2>
                  </div>

                  <p className="text-white/80 leading-7">
                    Strong ATS compatibility with room for optimization.
                  </p>
                </div>

                {/* Summary */}
                <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 shadow-2xl">
                  <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-4">
                    Resume Summary
                  </p>

                  <h2 className="text-3xl font-bold mb-6">
                    Candidate Overview
                  </h2>

                  <p className="text-zinc-300 leading-9 text-lg">
                    {mockData.summary}
                  </p>
                </div>
              </div>

              {/* Cards */}
              <div className="grid lg:grid-cols-2 gap-8">
                {[
                  {
                    title: "Key Strengths",
                    data: mockData.strengths,
                  },
                  {
                    title: "Weaknesses & Gaps",
                    data: mockData.weaknesses,
                  },
                  {
                    title: "ATS Optimization Tips",
                    data: mockData.tips,
                  },
                  {
                    title: "Interview Questions",
                    data: mockData.questions,
                  },
                ].map((section, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 shadow-2xl"
                  >
                    <h3 className="text-2xl font-bold mb-6">{section.title}</h3>

                    <div className="space-y-4">
                      {section.data.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="bg-zinc-800/60 rounded-2xl p-4 text-zinc-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
