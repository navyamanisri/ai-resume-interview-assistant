"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data.text || "No analysis returned.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "48px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          padding: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          AI Resume Interview Assistant
        </h1>

        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Upload your resume PDF to get an ATS score, analysis, and interview
          questions.
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Select Resume (PDF only)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              display: "block",
              width: "100%",
              fontSize: "14px",
              color: "#4b5563",
            }}
          />
          {file && (
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          style={{
            display: "block",
            width: "100%",
            backgroundColor: loading || !file ? "#d1d5db" : "#2563eb",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "16px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: loading || !file ? "not-allowed" : "pointer",
            marginTop: "16px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              color: "#b91c1c",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#1f2937",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
