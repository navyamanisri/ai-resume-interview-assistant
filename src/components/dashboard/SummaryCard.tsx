"use client";

import { motion } from "framer-motion";

type SummaryCardProps = {
  summary: string;
  strengths: string[];
};

export default function SummaryCard({
  summary,
  strengths,
}: SummaryCardProps) {
  return (
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
        {summary}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {strengths.map((item, index) => (
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
  );
}