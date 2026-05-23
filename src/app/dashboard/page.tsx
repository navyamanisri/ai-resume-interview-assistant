"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import UploadCard from "@/components/dashboard/UploadCard";
import ATSScoreCard from "@/components/dashboard/ATSScoreCard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import HistoryCard from "@/components/dashboard/HistoryCard";

type Analysis = {
  id: string;
  file_name: string;
  ats_score: number;
  summary: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [showAnalysis, setShowAnalysis] = useState(false);

  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // REAL AI STATES
  const [atsScore, setAtsScore] = useState(0);

  const [summary, setSummary] = useState("");

  const [strengths, setStrengths] = useState<string[]>([]);

  useEffect(() => {
    async function initializeDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("resume_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAnalyses(data);
      }
    }

    initializeDashboard();
  }, [router]);

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);

      // CALL AI API
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      // REAL AI RESPONSE
      setAtsScore(data.atsScore || 0);

      setSummary(data.summary || "");

      setStrengths(data.strengths || []);

      // CURRENT USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // SAVE TO DATABASE
      if (user) {
        await supabase.from("resume_analyses").insert([
          {
            user_id: user.id,
            file_name: file.name,
            ats_score: data.atsScore || 0,
            summary: data.summary || "",
          },
        ]);

        // REFRESH HISTORY
        const { data: updatedAnalyses, error } = await supabase
          .from("resume_analyses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && updatedAnalyses) {
          setAnalyses(updatedAnalyses);
        }
      }

      setLoading(false);

      setShowAnalysis(true);
    } catch (error) {
      console.error(error);

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-200px] left-[300px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <section className="flex-1 relative overflow-y-auto">
        <div className="relative z-10 px-8 py-8">
          {/* Header */}
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
          <UploadCard
            loading={loading}
            setFile={setFile}
            handleUpload={handleUpload}
          />

          {/* Loading */}
          {loading && (
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-12 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center mb-10">
              <div className="w-20 h-20 rounded-full border-4 border-zinc-700 border-t-white animate-spin mb-8" />

              <h2 className="text-3xl font-bold mb-4">
                AI Analysis In Progress
              </h2>

              <p className="text-zinc-400 text-lg">
                Processing resume intelligently...
              </p>
            </div>
          )}

          {/* AI Results */}
          {showAnalysis && !loading && (
            <div className="grid lg:grid-cols-3 gap-8 mb-10">
              <ATSScoreCard score={atsScore} />

              <SummaryCard summary={summary} strengths={strengths} />
            </div>
          )}

          {/* History */}
          <HistoryCard analyses={analyses} />
        </div>
      </section>
    </main>
  );
}
