"use client";

import { motion } from "framer-motion";

type UploadCardProps = {
  loading: boolean;
  setFile: (file: File | null) => void;
  handleUpload: () => void;
};

export default function UploadCard({
  loading,
  setFile,
  handleUpload,
}: UploadCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-zinc-900/70 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl mb-10"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-3">Upload Resume</h2>

        <p className="text-zinc-400 leading-8">
          Upload your PDF resume to receive intelligent ATS analysis and
          interview preparation insights.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="block w-full text-sm text-zinc-300
          file:mr-4 file:py-4 file:px-6
          file:rounded-2xl file:border-0
          file:text-sm file:font-semibold
          file:bg-white file:text-black
          hover:file:bg-zinc-200 cursor-pointer"
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all ${
            loading
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          {loading ? "Processing..." : "Analyze Resume"}
        </motion.button>
      </div>
    </motion.div>
  );
}
