import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJourneys } from "../services/api";

export default function GlobalOverview() {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJourneys()
      .then((res) => setJourneys(res.journeys || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalBudgets = journeys.reduce((sum, j) => sum + (j.budget?.total || (j.budget?.perDay * 5) || 0), 0);
  const totalStops = journeys.reduce((sum, j) => sum + (j.checkpoints?.length || 0), 0);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex antialiased">
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            A high-level look at your travel metrics and history.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading overview...</p>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-icons-round text-2xl">flight_takeoff</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Trips</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{journeys.length}</p>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-icons-round text-2xl">pin_drop</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Destinations</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalStops}</p>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <span className="material-icons-round text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Est. Spend</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹ {totalBudgets.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Journeys</h2>
              {journeys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {journeys.slice(0, 4).map(j => (
                    <Link key={j.id} to={`/timeline?id=${j.id}`} className="block p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-primary transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{j.title}</span>
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{j.status || 'Draft'}</span>
                      </div>
                      <div className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">calendar_today</span>
                        {j.dateRange || "TBA"}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <p className="mb-4">You have no journeys to display.</p>
                  <Link to="/plan" className="text-primary hover:underline">Plan your first trip!</Link>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
