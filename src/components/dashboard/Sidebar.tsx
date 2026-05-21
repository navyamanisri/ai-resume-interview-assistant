"use client";

import { motion } from "framer-motion";

export default function Sidebar() {
  return (
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
  );
}
