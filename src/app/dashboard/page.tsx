"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/dashboard/Sidebar";
import UploadCard from "@/components/dashboard/UploadCard";
import ATSScoreCard from "@/components/dashboard/ATSScoreCard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import HistoryCard from "@/components/dashboard/HistoryCard";
import { ResumeAnalysis, InterviewFeedback, AnalysisRecord } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "analysis" | "interview" | "settings">("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data States
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);

  // Active Loaded Analysis States
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(null);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Interview QA States
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Record<number, InterviewFeedback>>({});
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Settings states
  const [customKey, setCustomKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("resume_ai_custom_key") || "";
    }
    return "";
  });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Load user data and history on mount
  useEffect(() => {
    async function initializeDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Load previous analyses
      const { data, error: dbError } = await supabase
        .from("resume_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!dbError && data) {
        setAnalyses(data);
        
        // Auto-load the latest analysis if one exists
        if (data.length > 0) {
          loadAnalysisRecord(data[0]);
        }
      }
    }

    initializeDashboard();
  }, [router]);

  // Load a specific AnalysisRecord into active dashboard view
  function loadAnalysisRecord(record: AnalysisRecord) {
    try {
      const parsed = JSON.parse(record.summary) as ResumeAnalysis;
      if (parsed && typeof parsed === "object" && "atsScore" in parsed) {
        setActiveAnalysis(parsed);
      } else {
        throw new Error("Invalid structure");
      }
    } catch {
      // Fallback for old plain-text summary records
      setActiveAnalysis({
        atsScore: record.ats_score,
        summary: record.summary,
        strengths: [],
        weaknesses: [],
        tips: [],
        questions: [],
      });
    }
    setActiveFileName(record.file_name);
    setActiveId(record.id);
    // Clear Q&A session states
    setSelectedQuestionIndex(null);
    setUserAnswer("");
    setFeedbacks({});
    setFeedbackError(null);
  }

  // Handle click on History Card item
  function handleSelectHistoryItem(record: AnalysisRecord) {
    loadAnalysisRecord(record);
    setActiveTab("analysis"); // Move to analysis report tab
  }

  // Save custom key to localStorage
  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("resume_ai_custom_key", customKey);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  }

  // Clear custom key
  function handleClearKey() {
    localStorage.removeItem("resume_ai_custom_key");
    setCustomKey("");
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  }

  // Handle uploading and parsing a resume
  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("resume", file);

      // Read custom key if stored
      const savedKey = localStorage.getItem("resume_ai_custom_key") || "";

      // Send to backend
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: savedKey ? { "x-gemini-api-key": savedKey } : {},
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process resume.");
      }

      const parsedData = (await response.json()) as ResumeAnalysis;

      // Save to Supabase DB
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: insertData } = await supabase
          .from("resume_analyses")
          .insert([
            {
              user_id: user.id,
              file_name: file.name,
              ats_score: parsedData.atsScore || 0,
              summary: JSON.stringify(parsedData),
            },
          ])
          .select();

        // Refresh History
        const { data: updatedList } = await supabase
          .from("resume_analyses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (updatedList) {
          setAnalyses(updatedList);
        }

        // Set as active analysis
        if (insertData && insertData[0]) {
          loadAnalysisRecord(insertData[0]);
        } else {
          setActiveAnalysis(parsedData);
          setActiveFileName(file.name);
        }
      } else {
        // Unauthenticated fallback state
        setActiveAnalysis(parsedData);
        setActiveFileName(file.name);
      }

      setFile(null); // Clear file selection
      setActiveTab("analysis"); // Automatically switch to analysis tab to show the results

    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while uploading and parsing your resume."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle grading of interview answers
  async function handleGradeAnswer(question: string, index: number) {
    if (!userAnswer.trim()) return;

    try {
      setFeedbackLoading(true);
      setFeedbackError(null);

      const savedKey = localStorage.getItem("resume_ai_custom_key") || "";

      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(savedKey ? { "x-gemini-api-key": savedKey } : {}),
        },
        body: JSON.stringify({
          question,
          answer: userAnswer,
          resumeSummary: activeAnalysis?.summary || "",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze answer.");
      }

      const feedbackData = (await response.json()) as InterviewFeedback;

      // Cache feedback for this question index
      setFeedbacks((prev) => ({
        ...prev,
        [index]: feedbackData,
      }));

    } catch (err: unknown) {
      console.error(err);
      setFeedbackError(
        err instanceof Error ? err.message : "Could not retrieve answer feedback."
      );
    } finally {
      setFeedbackLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveAnalysis={activeAnalysis !== null}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-zinc-900 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-md font-bold tracking-tight text-white">
              ResumeAI
            </span>
          </div>

          <div className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg font-medium border border-indigo-500/10">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
        </header>

        {/* Dynamic Tab Screens */}
        <section className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:px-10 md:py-10">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-white">Error Encountered</p>
                <p className="mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white">Dashboard</h1>
                  <p className="text-sm text-zinc-400 mt-1">
                    Upload resumes and access historical career scoring assets.
                  </p>
                </div>

                {activeFileName && (
                  <div className="inline-flex items-center gap-2 bg-indigo-950/20 border border-indigo-900/60 rounded-xl px-4 py-2.5 text-xs text-indigo-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Active Resume: <strong className="text-white truncate max-w-[150px]">{activeFileName}</strong>
                  </div>
                )}
              </div>

              {/* Upload Component */}
              <UploadCard
                loading={loading}
                selectedFile={file}
                setFile={setFile}
                handleUpload={handleUpload}
              />

              {/* Analysis Loading Screen */}
              {loading && (
                <div className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <h3 className="font-bold text-white mb-2">Analyzing Resume with Gemini AI</h3>
                  <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                    Extracting PDF content, checking formatting, scoring keyword relevance, and generating interview questions...
                  </p>
                </div>
              )}

              {/* Active Report Mini-Overview */}
              {activeAnalysis && !loading && (
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Analysis Summary</span>
                      <h3 className="text-lg font-bold text-white mt-1">{activeFileName}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("analysis")}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      View Full Analysis & Tips
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">ATS MATCH</span>
                      <span className="text-3xl font-extrabold text-white mt-1">{activeAnalysis.atsScore}%</span>
                    </div>
                    <div className="sm:col-span-3 bg-zinc-950/40 border border-zinc-900 rounded-xl p-4">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Executive Overview</span>
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {activeAnalysis.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              <HistoryCard
                analyses={analyses}
                onSelectAnalysis={handleSelectHistoryItem}
                activeId={activeId}
              />
            </div>
          )}

          {/* TAB 2: DETAILED ANALYSIS */}
          {activeTab === "analysis" && activeAnalysis && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">ATS Analysis</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Detailed review of compatibility scoring and layout optimization rules.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <ATSScoreCard score={activeAnalysis.atsScore} />
                <SummaryCard
                  summary={activeAnalysis.summary}
                  strengths={activeAnalysis.strengths || []}
                  weaknesses={activeAnalysis.weaknesses || []}
                />
              </div>

              {/* Improvement Tips */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Actionable ATS Improvement Tips
                </h3>
                {activeAnalysis.tips && activeAnalysis.tips.length > 0 ? (
                  <ul className="space-y-3">
                    {activeAnalysis.tips.map((tip, index) => (
                      <li key={index} className="flex gap-3 text-sm text-zinc-300 leading-relaxed items-start">
                        <span className="h-5 w-5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center rounded-lg text-xs font-semibold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-500">No specific tips returned. Your resume is in solid shape!</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW PREPARATION */}
          {activeTab === "interview" && activeAnalysis && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Interview Practice</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Targeted questions generated from your experience. Write mock answers to receive instant grading.
                </p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Question List */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Practice Questions</h3>
                  {activeAnalysis.questions && activeAnalysis.questions.length > 0 ? (
                    activeAnalysis.questions.map((question, index) => {
                      const hasFeedback = feedbacks[index] !== undefined;
                      const isSelected = selectedQuestionIndex === index;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedQuestionIndex(index);
                            setUserAnswer("");
                            setFeedbackError(null);
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-indigo-950/15 border-indigo-500/60"
                              : "bg-zinc-900/20 border-zinc-800/80 hover:border-zinc-700"
                          }`}
                        >
                          <span className="h-5 w-5 text-[10px] font-bold bg-zinc-800 text-zinc-400 flex items-center justify-center rounded-lg shrink-0 mt-0.5">
                            Q{index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-200 font-medium leading-relaxed line-clamp-2">
                              {question}
                            </p>
                            {hasFeedback && (
                              <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-400">
                                Graded: {feedbacks[index].score}/100
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-zinc-500">No custom interview questions generated for this resume.</p>
                  )}
                </div>

                {/* Practice & Feedback Panel */}
                <div className="lg:col-span-7">
                  {selectedQuestionIndex !== null && activeAnalysis.questions ? (
                    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">PRACTICE AREA</span>
                        <h4 className="text-sm font-bold text-white mt-1 leading-relaxed">
                          {activeAnalysis.questions[selectedQuestionIndex]}
                        </h4>
                      </div>

                      {/* Feedback Display if graded */}
                      {feedbacks[selectedQuestionIndex] && (
                        <div className="border border-zinc-800 bg-zinc-950/40 rounded-xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI EVALUATION</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                              feedbacks[selectedQuestionIndex].score >= 80
                                ? "bg-emerald-500/10 text-emerald-400"
                                : feedbacks[selectedQuestionIndex].score >= 50
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                            }`}>
                              Grade: {feedbacks[selectedQuestionIndex].score}/100
                            </span>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Feedback Summary</p>
                            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                              {feedbacks[selectedQuestionIndex].feedback}
                            </p>
                          </div>

                          <div className="border-t border-zinc-900 pt-4">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Polished Model Answer (STAR)</p>
                            <p className="text-xs text-zinc-400 leading-relaxed italic bg-zinc-950/60 p-3 rounded-lg border border-zinc-900">
                              &ldquo;{feedbacks[selectedQuestionIndex].betterAnswer}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Input practice box */}
                      <div className="space-y-3">
                        <label htmlFor="answer-input" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          Your Written Response
                        </label>
                        <textarea
                          id="answer-input"
                          rows={6}
                          placeholder="Type your answer here. Try to use structure (e.g. STAR method) and mention relevant resume projects..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 transition-colors resize-none leading-relaxed"
                        />
                        {feedbackError && (
                          <p className="text-xs text-red-400 font-medium">{feedbackError}</p>
                        )}
                        <div className="flex justify-end pt-1">
                          <button
                            disabled={feedbackLoading || !userAnswer.trim()}
                            onClick={() =>
                              handleGradeAnswer(
                                activeAnalysis.questions![selectedQuestionIndex],
                                selectedQuestionIndex
                              )
                            }
                            className="bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-200 disabled:bg-zinc-850 disabled:text-zinc-600 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
                          >
                            {feedbackLoading && (
                              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            )}
                            {feedbackLoading ? "Grading..." : "Submit Answer for Grading"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-zinc-850 bg-zinc-900/5 rounded-2xl p-12 text-center text-zinc-600 text-xs">
                      Select a question from the list on the left to start writing and grading your answers.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">SaaS Settings</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Manage your developer configurations and custom AI integrations.
                </p>
              </div>

              {settingsSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm font-medium">
                  Settings saved successfully!
                </div>
              )}

              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Google Gemini API Configuration</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    By default, the platform uses a shared server-side key to parse resumes. If you hit quota limits, you can generate your own free key from Google AI Studio and configure it below. This key will be saved locally on your device and will override the default key.
                  </p>
                </div>

                <form onSubmit={handleSaveKey} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="custom-api-key" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Custom Gemini API Key
                    </label>
                    <input
                      id="custom-api-key"
                      type="password"
                      placeholder={customKey ? "••••••••••••••••••••••••••••••••••••" : "Paste your AI Studio API key here (AIzaSy...)"}
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={!customKey}
                      className="bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-50"
                    >
                      Save Key
                    </button>
                    {localStorage.getItem("resume_ai_custom_key") && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="bg-red-950/20 border border-red-900/30 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-red-950/40 transition-colors"
                      >
                        Reset to Default Key
                      </button>
                    )}
                  </div>
                </form>

                <div className="border-t border-zinc-800/80 pt-6 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">How to get a free API Key?</h4>
                  <ol className="text-xs text-zinc-500 space-y-2 list-decimal pl-4 leading-relaxed">
                    <li>Go to the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a> console.</li>
                    <li>Sign in with your Google account.</li>
                    <li>Click on the <strong>&ldquo;Get API Key&rdquo;</strong> button in the left sidebar.</li>
                    <li>Click <strong>&ldquo;Create API Key&rdquo;</strong>, select a project, and copy the generated key.</li>
                    <li>Paste it here and click save. Your usage is free up to 15 requests per minute!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
