"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Fahad Rahman's
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              AI Coding Mentor
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Paste a LeetCode style problem and your solution. The mentor gives you
              structured feedback on patterns, edge cases, and complexity.
            </p>
          </div>
          {/* <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Built with Next.js + OpenAI
          </div> */}
        </header>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Left column - inputs */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">
                Problem name
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                value={problemName}
                onChange={e => setProblemName(e.target.value)}
                placeholder="Longest Substring Without Repeating Characters"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">
                Pattern
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
              >
                <option value="arrays-hashing">Arrays and Hashing</option>
                <option value="two-pointers">Two Pointers</option>
                <option value="sliding-window">Sliding Window</option>
                <option value="stack">Stack</option>
                <option value="binary-search">Binary Search</option>
                <option value="dp">Dynamic Programming</option>
                <option value="graph">Graphs</option>
              </select>
            </div>

            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">
                Your code
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-900/80 bg-slate-950 px-3 py-3 text-sm font-mono text-slate-50 outline-none ring-0 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-600/40"
                rows={14}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste your solution here..."
              />
              <p className="text-[11px] text-slate-500">
                Paste Python, Java, C++, etc. The mentor looks at logic and pattern,
                not just syntax.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {loading ? "Thinking..." : "Ask mentor"}
              </button>
              {error && (
                <p className="text-xs text-red-500">
                  {error}
                </p>
              )}
            </div>
          </section>

          {/* Right column - feedback */}
          <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Mentor feedback
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Pattern review
              </span>
            </div>

            {feedback ? (
  <div className="flex-1 overflow-y-auto rounded-xl bg-slate-50 px-3 py-3 text-sm">
    <div className="space-y-2 text-sm leading-relaxed text-slate-800">
      <ReactMarkdown
        components={{
          li: ({ node, ...props }) => (
            <li className="ml-4 list-disc" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="rounded bg-slate-200 px-1 py-0.5 text-xs" {...props} />
          ),
        }}
      >
        {feedback}
      </ReactMarkdown>
    </div>
  </div>
) : (
  <div className="flex-1 rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">
    Run your first analysis to see:
    <ul className="mt-2 list-disc pl-5">
      <li>Detected pattern</li>
      <li>Logical or edge case issues</li>
      <li>Time and space complexity</li>
      <li>Concrete suggestions to improve</li>
    </ul>
  </div>
)}


            <p className="mt-3 text-[11px] text-slate-500">
              Tip - keep the same problem and try alternative solutions to see how the mentor
              evaluates different patterns.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
