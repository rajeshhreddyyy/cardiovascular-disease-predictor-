import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RISK_VALUE = 72;

export default function LandingPage() {
  const [animatedRisk, setAnimatedRisk] = React.useState(0);

  React.useEffect(() => {
    let startTs: number | null = null;
    const duration = 1500;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(RISK_VALUE * easeOutCubic(progress));
      setAnimatedRisk(value);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-blue-100/70 bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:p-10">
        <div className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-blue-600/10 via-cyan-300/10 to-purple-500/10 animate-ai-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl animate-float-slow" />
        <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl animate-float-slower" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-35">
          <div className="flex w-[200%] animate-ecg-slide">
            <svg className="h-24 w-1/2" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M0 70 L120 70 L160 35 L190 90 L220 50 L250 70 L420 70 L460 35 L490 90 L520 50 L550 70 L720 70 L760 35 L790 90 L820 50 L850 70 L1200 70"
                fill="none"
                stroke="rgba(94, 234, 212, 0.7)"
                strokeWidth="2.5"
                style={{ filter: "drop-shadow(0 0 6px rgba(45,212,191,0.7))" }}
              />
            </svg>
            <svg className="h-24 w-1/2" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M0 70 L120 70 L160 35 L190 90 L220 50 L250 70 L420 70 L460 35 L490 90 L520 50 L550 70 L720 70 L760 35 L790 90 L820 50 L850 70 L1200 70"
                fill="none"
                stroke="rgba(94, 234, 212, 0.7)"
                strokeWidth="2.5"
                style={{ filter: "drop-shadow(0 0 6px rgba(45,212,191,0.7))" }}
              />
            </svg>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200/40"
              style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 18}%` }}
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              AI Powered • Clinical-grade insights • Fast & Accurate
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="text-cyan-300">AI</span> Heart Attack{" "}
              <span className="text-purple-300">Prediction</span> & Risk Intelligence
            </h1>

            <p className="mt-4 max-w-xl text-blue-100/90">
              Transform patient parameters into actionable clinical insight through a modern ML workflow built for
              speed, trust, and clarity.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="relative inline-flex">
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-cyan-300/35 blur-md animate-pulse-ripple" />
                <Link
                  to="/predict"
                  className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.45)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_18px_35px_rgba(99,102,241,0.55)]"
                >
                  Start Assessment
                </Link>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition duration-300 hover:bg-white/20"
              >
                How It Works
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-xs text-blue-100">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Privacy Focused</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Real-time Results</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Healthcare UX</span>
            </div>
          </div>

          <div className="animate-fade-up-delayed">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(8,47,73,0.45)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Clinical Analytics Panel</div>
                <div className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs text-emerald-200">Live</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-xs text-blue-100">Risk Score</div>
                  <div className="mt-1 text-2xl font-bold text-white">{animatedRisk}%</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-xs text-blue-100">Prediction Time</div>
                  <div className="mt-1 text-2xl font-bold text-white">&lt; 2s</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <div className="text-xs text-blue-100">Risk Distribution</div>
                <div className="mt-3 h-2 rounded-full bg-white/20">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${RISK_VALUE}%` }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-blue-100">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-white/10 p-3 text-xs text-blue-100">
                Heart rhythm and blood pressure trends are elevated. Recommend clinical follow-up.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: "🧠", title: "Explainable Inputs", desc: "Field-by-field medical context for confident data entry." },
          { icon: "📊", title: "Visual Risk Results", desc: "Understand outcomes through indicators and clear insights." },
          { icon: "🛰️", title: "Advanced Dashboard", desc: "Monitor trends and risk profiles from one clean interface." }
        ].map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur transition duration-300 hover:border-cyan-200 hover:shadow-[0_18px_35px_rgba(34,211,238,0.25)]"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 -skew-x-12 bg-gradient-to-r from-cyan-200/0 via-cyan-200/50 to-cyan-200/0 opacity-0 group-hover:opacity-100 group-hover:animate-scan-line" />
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-xl">
              {card.icon}
            </div>
            <div className="mt-4 text-base font-semibold text-slate-900">{card.title}</div>
            <div className="mt-1 text-sm text-slate-600">{card.desc}</div>
          </motion.div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-soft backdrop-blur sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            { step: "01", title: "Enter Patient Details", icon: "🩺" },
            { step: "02", title: "ML Model Analysis", icon: "⚙️" },
            { step: "03", title: "Get Risk Prediction", icon: "📈" }
          ].map((item) => (
            <div key={item.step} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-semibold text-blue-700">Step {item.step}</div>
              <div className="mt-2 text-2xl">{item.icon}</div>
              <div className="mt-2 text-base font-semibold text-slate-900">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900">Why Choose Us</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Accuracy-focused ML predictions",
              "Fast results in seconds",
              "Simple and easy-to-use workflow",
              "Clinically relevant health parameters"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-soft">
          <div className="text-sm text-blue-100">Performance Snapshot</div>
          <div className="mt-3 space-y-4">
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-xs text-blue-100">Model confidence benchmark</div>
            </div>
            <div>
              <div className="text-3xl font-bold">&lt; 2s</div>
              <div className="text-xs text-blue-100">Average prediction latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-xs text-blue-100">Available web access</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

