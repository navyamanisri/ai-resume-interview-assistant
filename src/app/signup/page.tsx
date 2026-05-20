"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/login",
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 outline-none"
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 outline-none"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}
