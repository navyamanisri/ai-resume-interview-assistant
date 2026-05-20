"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [userEmail, setUserEmail] = useState("");

  const [analysisComplete, setAnalysisComplete] = useState(false);

  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
      } else {
        router.push("/login");
      }
    }

    getUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  function handleAnalyzeResume() {
    if (!selectedFile) {
      alert("Please upload a PDF resume first.");
      return;
    }

    setAnalysisComplete(true);
  }

  function handleGenerateQuestions() {
    setShowQuestions(true);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ResumeAI</h1>

        <div className="flex items-center gap-4">
          <p className="text-gray-400">{userEmail}</p>

          <button
            onClick={handleLogout}
            className="border border-gray-700 px-4 py-2 rounded-xl hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <h1 className="text-5xl font-bold mb-3">Dashboard</h1>

        <p className="text-gray-400 mb-10">
          Manage resumes, ATS analysis, and interview preparation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Resume Analysis</h2>

            <p className="text-gray-400">
              Upload your resume and get AI feedback.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3">ATS Score</h2>

            <p className="text-gray-400">
              Check how ATS-friendly your resume is.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Interview Questions</h2>

            <p className="text-gray-400">
              Generate AI interview questions instantly.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Upload Resume</h2>

          <p className="text-gray-400 mb-6">
            Upload your resume in PDF format for AI analysis.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="mb-4 block w-full text-sm text-gray-300"
          />

          {selectedFile && (
            <p className="text-green-400 mb-4">
              Selected File: {selectedFile.name}
            </p>
          )}

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleAnalyzeResume}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Analyze Resume
            </button>

            <button
              onClick={handleGenerateQuestions}
              className="border border-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Generate Interview Questions
            </button>
          </div>
        </div>

        {analysisComplete && (
          <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">AI Resume Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">ATS Score</h3>

                <p className="text-5xl font-bold text-green-400">82%</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">Resume Strength</h3>

                <p className="text-gray-300">
                  Strong technical skills and project experience.
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">Improvements</h3>

                <p className="text-gray-300">
                  Add more measurable achievements and leadership experience.
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Recommended Keywords
                </h3>

                <p className="text-gray-300">
                  React.js, Next.js, TypeScript, AI, Problem Solving
                </p>
              </div>
            </div>
          </div>
        )}

        {showQuestions && (
          <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">AI Interview Questions</h2>

            <div className="space-y-4">
              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <p>1. Explain the difference between React and Next.js.</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <p>2. What is server-side rendering in Next.js?</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <p>3. Explain your AI Resume Assistant project architecture.</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <p>4. How does authentication work using Supabase?</p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-6">
                <p>
                  5. Describe a challenge you faced while building this project.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
