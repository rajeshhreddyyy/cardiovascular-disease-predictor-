import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageBackButton from "../components/PageBackButton";

export default function ResultPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const state = loc.state as { prediction?: string; probability?: number; mode?: string } | undefined;

  const prediction = state?.prediction ?? "—";
  const probability = typeof state?.probability === "number" ? state?.probability : null;
  const percentText = probability === null ? "—" : `${Math.round(probability * 100)}%`;
  const pct = probability === null ? 0 : Math.round(probability * 100);

  const riskLevel = probability === null ? prediction : pct < 35 ? "Low Risk" : pct < 65 ? "Medium Risk" : "High Risk";
  const riskColor =
    riskLevel === "High Risk" ? "text-red-600" : riskLevel === "Medium Risk" ? "text-amber-600" : "text-emerald-600";
  const progressColor =
    riskLevel === "High Risk" ? "bg-red-500" : riskLevel === "Medium Risk" ? "bg-amber-500" : "bg-emerald-500";
  const modeLabel = state?.mode ?? "Basic Prediction";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <PageBackButton fallbackPath="/predict" />
        <div className="text-sm text-slate-500">Home &gt; Patient Details &gt; Result</div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:col-span-2 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900">Prediction Result</h1>
          <p className="mt-2 text-slate-600">AI-estimated heart attack risk based on submitted patient details.</p>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {modeLabel}
            </div>
            <div className="text-sm text-slate-500">Risk Category</div>
            <div className={`mt-1 text-3xl font-bold ${riskColor}`}>{riskLevel}</div>

            <div className="mt-4 text-sm text-slate-600">Probability: {percentText}</div>
            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div className={`h-3 rounded-full ${progressColor}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Medical Insight: This output helps prioritize attention. Combine with doctor consultation and diagnostic
            tests for clinical decisions.
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => nav("/predict")}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              Back to Patient Details
            </button>
            <button
              onClick={() => nav("/dashboard")}
              className="px-6 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              Open Dashboard
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Recommendation</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- Low risk: maintain lifestyle habits and regular checkups.</li>
            <li>- Medium risk: discuss results with a healthcare professional.</li>
            <li>- High risk: seek timely clinical evaluation and follow-up tests.</li>
          </ul>
          <p className="mt-5 text-xs text-slate-500">Educational/demo purposes only. Not medical advice.</p>
        </aside>
      </div>
    </main>
  );
}

