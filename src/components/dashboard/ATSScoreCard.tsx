"use client";

import { motion } from "framer-motion";

type ATSScoreCardProps = {
  score: number;
};

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-[32px] p-8 min-h-[320px] flex flex-col justify-between shadow-2xl"
    >
      <div>
        <p className="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
          ATS SCORE
        </p>

        <h2 className="text-8xl font-bold">{score}</h2>
      </div>

      <p className="text-white/80 leading-8">
        Strong ATS compatibility with measurable optimization opportunities.
      </p>
    </motion.div>
  );
}
