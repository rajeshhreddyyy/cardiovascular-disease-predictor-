import React from "react";
import { Routes, Route, Link, Navigate, NavLink, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import PredictionFormPage from "./pages/PredictionFormPage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./auth/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-2.5 py-1.5 transition ${
      isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-soft flex items-center justify-center text-white font-bold">
              AI
            </div>
            <Link to="/" className="font-semibold text-slate-900 hover:opacity-90 transition">
              CardioInsights
            </Link>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink to="/" className={navItemClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navItemClass}>
              About
            </NavLink>
            <NavLink to="/predict" className={navItemClass}>
              Patient Details
            </NavLink>
            <NavLink to="/dashboard" className={navItemClass}>
              Dashboard
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navItemClass}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 font-medium text-white shadow-soft transition hover:opacity-95"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {initials}
                </div>
                <span className="hidden text-slate-600 sm:inline">{user?.name}</span>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/predict"
          element={
            <ProtectedRoute>
              <PredictionFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="/result" element={<ResultPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

