"use client";

import { useState } from "react";

export default function Home() {
  const [problemName, setProblemName] = useState("");
  const [code, setCode] = useState("");
  const [pattern, setPattern] = useState("sliding-window");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemName, code, pattern }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-3xl p-6 space-y-4">
        <h1 className="text-3xl font-semibold">AI Coding Mentor</h1>
        <p className="text-sm text-slate-400">
          Paste a LeetCode style problem and your solution. The mentor will give you structured feedback.
        </p>

        <label className="block text-sm space-y-1">
          <span>Problem name</span>
          <input
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={problemName}
            onChange={e => setProblemName(e.target.value)}
            placeholder="Longest Substring Without Repeating Characters"
          />
        </label>

        <label className="block text-sm space-y-1">
          <span>Pattern</span>
          <select
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
          >
            <option value="arrays-hashing">Arrays and Hashing</option>
            <option value="two-pointers">Two Pointers</option>
            <option value="sliding-window">Sliding Window</option>
            <option value="stack">Stack</option>
            <option value="binary-search">Binary Search</option>
            <option value="dp">Dynamic Programming</option>
            <option value="graph">Graph</option>
          </select>
        </label>

        <label className="block text-sm space-y-1">
          <span>Your code</span>
          <textarea
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono"
            rows={12}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Paste your solution here..."
          />
        </label>

        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-40"
        >
          {loading ? "Thinking..." : "Ask mentor"}
        </button>

        {error && (
          <p className="text-sm text-red-400 mt-2">
            {error}
          </p>
        )}

        {feedback && (
          <div className="mt-4 rounded border border-slate-700 bg-slate-900 p-3">
            <h2 className="mb-2 text-sm font-semibold">Mentor feedback</h2>
            <pre className="whitespace-pre-wrap text-xs">{feedback}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
