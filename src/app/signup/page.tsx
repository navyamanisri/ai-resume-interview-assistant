"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSignup() {
    try {
      setLoading(true);

      setError("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);

      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* Glow */}
      <div className="absolute top-[-200px] left-[100px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl">
        <div className="mb-8">
          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mb-4">
            AI Resume Platform
          </p>

          <h1 className="text-4xl font-bold mb-4">Create Account</h1>

          <p className="text-zinc-400 leading-8">
            Start your AI-powered resume analysis journey.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-3">Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-zinc-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              loading
                ? "bg-zinc-700 cursor-not-allowed"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
}
