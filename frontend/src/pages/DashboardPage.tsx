import React from "react";
import { getPatientHistory, type PatientHistoryItem } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageBackButton from "../components/PageBackButton";

export default function DashboardPage() {
  const { token } = useAuth();
  const [history, setHistory] = React.useState<PatientHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const rows = await getPatientHistory(token);
        if (mounted) setHistory(rows);
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message ?? "Failed to load history.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const total = history.length;
  const highCount = history.filter((h) => h.prediction_result.toLowerCase().includes("high")).length;
  const mediumCount = history.filter((h) => h.prediction_result.toLowerCase().includes("medium")).length;
  const lowCount = Math.max(total - highCount - mediumCount, 0);
  const highPct = total ? Math.round((highCount / total) * 100) : 0;
  const mediumPct = total ? Math.round((mediumCount / total) * 100) : 0;
  const lowPct = total ? Math.round((lowCount / total) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <PageBackButton fallbackPath="/" />
        <div className="text-sm text-slate-500">Home &gt; Dashboard</div>
      </div>
      <h1 className="text-3xl font-bold text-slate-900">AI Risk Dashboard</h1>
      <p className="mt-2 text-slate-600">Overview of recent assessments and risk distribution.</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm text-slate-500">Assessments</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{total}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm text-slate-500">Low Risk Ratio</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{lowPct}%</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm text-slate-500">High Risk Ratio</div>
          <div className="mt-1 text-3xl font-bold text-red-600">{highPct}%</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm text-slate-500">Data Source</div>
          <div className="mt-1 text-xl font-bold text-slate-900">MySQL History</div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Risk Distribution</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>Low</span>
                <span>{lowPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${lowPct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>Medium</span>
                <span>{mediumPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${mediumPct}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-600">
                <span>High</span>
                <span>{highPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-red-500" style={{ width: `${highPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-slate-900">Trend</h2>
          <p className="mt-2 text-sm text-slate-600">
            Weekly trends can be connected to historical API data.
          </p>
          <div className="mt-4 h-32 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="font-semibold text-slate-900">Recent Assessments</h2>
        {loading ? <div className="mt-3 text-sm text-slate-500">Loading history...</div> : null}
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        <div className="mt-3 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2">Patient ID</th>
                <th className="py-2">Date</th>
                <th className="py-2">Risk</th>
                <th className="py-2">Prediction Type</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-900">P-{row.id}</td>
                  <td className="py-2 text-slate-700">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="py-2 text-slate-700">{row.prediction_result}</td>
                  <td className="py-2 text-slate-700">{row.prediction_type}</td>
                </tr>
              ))}
              {!loading && history.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={4}>
                    No records yet. Submit a prediction to see history here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

