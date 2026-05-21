"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const mockData = {
  score: 84,

  summary:
    "Strong frontend-focused candidate with React, Next.js, and TypeScript experience. Demonstrates excellent project-building capabilities and deployment understanding.",

  strengths: [
    "Strong React fundamentals",
    "Excellent TypeScript usage",
    "Clean architecture understanding",
    "Deployment workflow knowledge",
  ],
};

const loadingSteps = [
  "Uploading resume...",
  "Extracting PDF content...",
  "Analyzing ATS compatibility...",
  "Generating interview insights...",
  "Preparing AI report...",
];

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (!loading) return;

    let current = 0;

    setLoadingText(loadingSteps[0]);

    const interval = setInterval(() => {
      current++;

      if (current < loadingSteps.length) {
        setLoadingText(loadingSteps[current]);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [loading]);

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);
      setShowAnalysis(false);

      const formData = new FormData();
      formData.append("resume", file);

      await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      // Simulated premium loading feel
      setTimeout(() => {
        setLoading(false);
        setShowAnalysis(true);
      }, 4500);
    } catch (err) {
      console.error(err);

      setTimeout(() => {
        setLoading(false);
        setShowAnalysis(true);
      }, 4500);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-200px] left-[300px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] border-r border-zinc-800 bg-zinc-950 flex-col p-8">
        <div className="mb-14">
          <div className="w-14 h-14 rounded-3xl bg-white text-black flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
            AI
          </div>

          <h2 className="text-3xl font-bold">Resume Assistant</h2>

          <p className="text-zinc-500 mt-4 leading-7">
            AI powered ATS and interview preparation platform.
          </p>
        </div>

        <nav className="space-y-3">
          {[
            "Dashboard",
            "Resume Analysis",
            "Interview Questions",
            "ATS Reports",
            "Settings",
          ].map((item, index) => (
            <motion.div
              whileHover={{ x: 4 }}
              key={item}
              className={`px-5 py-4 rounded-2xl transition-all cursor-pointer ${
                index === 0
                  ? "bg-white text-black font-medium"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {item}
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-sm text-zinc-500 mb-4">AI STATUS</p>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

              <p className="text-sm text-zinc-300">Systems Operational</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 relative">
        <div className="relative z-10 px-8 py-8">
          {/* Top */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-3">
                AI Resume Platform
              </p>

              <h1 className="text-5xl font-bold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl text-sm text-zinc-400">
                AI Analysis Engine
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500" />
            </div>
          </div>

          {/* Upload */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl mb-10"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-3">Upload Resume</h2>

              <p className="text-zinc-400 leading-8">
                Upload your resume to receive ATS analysis and AI-powered
                interview preparation insights.
              </p>
            </div>

            <div className="flex flex-col gap-6">
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

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all ${
                  loading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {loading ? "Processing..." : "Analyze Resume"}
              </motion.button>
            </div>
          </motion.div>

          {/* Loading Screen */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-12 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-white animate-spin mb-8" />

              <h2 className="text-3xl font-bold mb-4">
                AI Analysis In Progress
              </h2>

              <p className="text-zinc-400 text-lg">{loadingText}</p>
            </motion.div>
          )}

          {/* Results */}
          {showAnalysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* ATS */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-[32px] p-8 min-h-[320px] flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                    ATS SCORE
                  </p>

                  <h2 className="text-8xl font-bold">{mockData.score}</h2>
                </div>

                <p className="text-white/80 leading-8">
                  Strong ATS compatibility with measurable optimization
                  opportunities.
                </p>
              </motion.div>

              {/* Summary */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 shadow-2xl"
              >
                <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-4">
                  Candidate Summary
                </p>

                <h2 className="text-4xl font-bold mb-6">
                  Resume Intelligence Report
                </h2>

                <p className="text-zinc-300 leading-9 text-lg">
                  {mockData.summary}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-10">
                  {mockData.strengths.map((item, index) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={index}
                      className="bg-zinc-800/60 rounded-2xl p-5 text-zinc-300"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
