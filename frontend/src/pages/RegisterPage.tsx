import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full Name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await register(fullName, email, password);
      nav("/predict", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Unable to register.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-8 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-2 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />

      <section className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/85 p-7 shadow-soft backdrop-blur-md sm:p-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
          Create Account
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Create your account to start clinical risk assessments.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
              placeholder="Create password"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
              placeholder="Confirm password"
            />
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

