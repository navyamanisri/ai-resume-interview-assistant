import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header / Nav */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-indigo-500/20 shadow-md">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text">
            ResumeAI
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-6 py-12 md:py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-8 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Next-Gen AI Career Assistant
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl">
          Optimize your resume for{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            ATS & Interviews
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Upload your resume to get instant ATS optimization tips, detailed
          strengths analysis, and practice interview questions with personalized AI feedback.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/signup"
            className="w-full sm:w-auto text-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/15"
          >
            Analyze Your Resume Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto text-center border border-zinc-800 bg-zinc-900/20 px-8 py-4 rounded-xl font-semibold hover:bg-zinc-900 transition-colors text-zinc-300"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="border border-zinc-900 bg-zinc-900/20 rounded-2xl p-8 hover:border-zinc-800/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-5">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Structured ATS Checker
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Get an instant compatibility score and clear suggestions to fix formatting and wording errors that recruiters filter out.
            </p>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/20 rounded-2xl p-8 hover:border-zinc-800/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold mb-5">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Strengths & Gaps Audit
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Understand how your experience is perceived by AI. Identify core professional highlights and potential resume weaknesses.
            </p>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/20 rounded-2xl p-8 hover:border-zinc-800/80 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-5">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Interactive Mock Prep
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Generate custom interview questions and practice typing answers. Get tailored AI grading and a model STAR answer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        <p>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
      </footer>
    </main>
  );
}
