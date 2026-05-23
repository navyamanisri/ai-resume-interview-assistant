"use client";

import { useState } from "react";

type UploadCardProps = {
  loading: boolean;
  selectedFile: File | null;
  setFile: (file: File | null) => void;
  handleUpload: () => void;
};

export default function UploadCard({
  loading,
  selectedFile,
  setFile,
  handleUpload,
}: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setFile(file);
      }
    }
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <h2 className="text-xl font-bold text-white mb-2">Analyze New Resume</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Upload your PDF resume to generate an instant ATS scoring and targeted interview prep analysis.
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragOver
            ? "border-indigo-500 bg-indigo-500/5"
            : selectedFile
            ? "border-zinc-700 bg-zinc-900/10"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <svg
          className={`w-10 h-10 mb-4 transition-colors ${
            selectedFile ? "text-indigo-400" : "text-zinc-500"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-white max-w-xs truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">
              Drag and drop your PDF here, or <span className="text-indigo-400 hover:underline">browse</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">Supports PDF up to 10MB</p>
          </div>
        )}
      </div>

      <button
        disabled={!selectedFile || loading}
        onClick={handleUpload}
        className="w-full mt-6 bg-white text-black font-semibold text-sm py-3.5 rounded-xl hover:bg-zinc-200 active:scale-[0.99] transition-all disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? "Processing..." : "Analyze Resume"}
      </button>
    </div>
  );
}
