import React from "react";

const steps = [
  "Enter patient details and clinical parameters.",
  "The ML model transforms values into normalized feature signals.",
  "Risk probability is computed using trained heart-disease patterns.",
  "The system returns Low, Medium, or High risk with guidance."
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9">
        <h1 className="text-3xl font-bold text-slate-900">About the System</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Heart Attack Detection System is a machine-learning powered web platform that helps estimate
          cardiovascular risk from clinical inputs. It is designed for clarity, speed, and easier understanding.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">Purpose</div>
            <p className="mt-1 text-sm text-slate-600">Assist early risk awareness from structured patient data.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">Model Output</div>
            <p className="mt-1 text-sm text-slate-600">Risk class and probability score for quick interpretation.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">User Focus</div>
            <p className="mt-1 text-sm text-slate-600">Simple descriptions for non-medical users and students.</p>
          </div>
        </div>
      </section>

      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9">
        <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {steps.map((step, idx) => (
            <div key={step} className="rounded-2xl border border-slate-200 p-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                {idx + 1}
              </div>
              <p className="mt-2 text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This tool provides educational risk estimation and is not a replacement for professional diagnosis.
        </div>
      </section>
    </main>
  );
}

