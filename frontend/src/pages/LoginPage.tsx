import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const targetPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/predict";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");

    setLoading(true);
    try {
      await login(email, password);
      nav(targetPath, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Unable to login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />

      <section className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/85 p-7 shadow-soft backdrop-blur-md sm:p-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
          Clinical Access
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to access Patient Details and Dashboard.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-200">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-slate-900 outline-none"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-slate-500 hover:text-slate-700">
              Forgot Password?
            </button>
            <Link to="/register" className="text-blue-700 hover:text-blue-800">
              Don't have an account? Register
            </Link>
          </div>

          {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-soft transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

