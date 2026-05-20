import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">ResumeAI</h1>

        <div className="flex gap-6 text-gray-300">
          <a href="#" className="hover:text-white transition">
            Features
          </a>

          <a href="#" className="hover:text-white transition">
            About
          </a>

          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </nav>

      <div className="mb-6 rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300">
        AI Powered Career Assistant
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center leading-tight">
        AI Resume & Interview Assistant
      </h1>

      <p className="text-gray-300 text-xl max-w-2xl text-center px-4">
        Build smarter resumes. Prepare better interviews.
      </p>

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <Link
          href="/signup"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </Link>

        <Link
          href="/login"
          className="border border-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Login
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <h2 className="text-xl font-semibold mb-3">AI Resume Analysis</h2>

          <p className="text-gray-400">
            Get smart AI feedback to improve your resume instantly.
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <h2 className="text-xl font-semibold mb-3">ATS Score Checker</h2>

          <p className="text-gray-400">
            Analyze how well your resume matches recruiter systems.
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
          <h2 className="text-xl font-semibold mb-3">Interview Questions</h2>

          <p className="text-gray-400">
            Generate personalized interview questions using AI.
          </p>
        </div>
      </div>
    </main>
  );
}
