import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJourneys, deleteJourney } from "../services/api";
import PlaceImage from "../components/PlaceImage";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [showAllJourneys, setShowAllJourneys] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getJourneys()
      .then((res) => {
        if (!mounted) return;
        setJourneys(res.journeys || []);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to load journeys");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const profile = useMemo(() => user?.profile || {}, [user]);
  const memberSince = useMemo(
    () => (user?.createdAt ? new Date(user.createdAt).getFullYear() : null),
    [user],
  );
  const displayName = user?.name || user?.email || "User";
  const avatar = profile?.avatar || "/images/default-avatar.png";
  const preferredCurrency = profile?.preferences?.currency || "USD";
  const getCurrencySymbol = (code) => {
    switch (code) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR': return '₹';
      case 'USD': default: return '$';
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await deleteJourney(id);
      setJourneys(journeys => journeys.filter(j => j.id !== id));
    } catch(err) {
      console.error(err);
      alert("Failed to delete journey.");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark min-h-screen flex antialiased selection:bg-primary/30 selection:text-primary">
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your travel history and upcoming routes.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-icons text-primary">
                  flight_takeoff
                </span>
                My Journeys
              </h3>
              {journeys.length > 4 && !showAllJourneys && (
                <button 
                  className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
                  onClick={() => setShowAllJourneys(true)}
                >
                  View All
                  <span className="material-icons text-base">arrow_forward</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading && (
                <div className="col-span-1 md:col-span-2 text-slate-500 dark:text-slate-400">
                  Loading journeys...
                </div>
              )}
              {error && (
                <div className="col-span-1 md:col-span-2 text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3">
                  {error}
                </div>
              )}
              {!loading && !error && journeys.length === 0 && (
                <div className="col-span-1 md:col-span-2">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 dark:from-slate-800/50 dark:via-slate-900/50 dark:to-cyan-900/10 border border-slate-200/60 dark:border-slate-700/50 p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[380px] shadow-sm">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative mb-8">
                      <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 mx-auto relative z-10">
                        <span className="material-icons-round text-5xl text-transparent bg-clip-text bg-gradient-to-tr from-primary to-cyan-400">explore</span>
                      </div>
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-60"></div>
                      <div className="absolute -inset-4 bg-primary/5 rounded-full animate-pulse transition-all"></div>
                    </div>
                    
                    <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4">
                      Ready for an adventure?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                      Your travel map is empty. Start crafting your perfect itinerary, discovering new places, and tracking your budget today.
                    </p>
                    
                    <Link
                      to="/plan"
                      className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                      <span className="material-icons-round mr-2 text-xl relative z-10">add_location_alt</span>
                      <span className="relative z-10">Plan a New Trip</span>
                    </Link>
                  </div>
                </div>
              )}
              {(showAllJourneys ? journeys : journeys.slice(0, 4)).map((journey) => (
                <Link
                  key={journey.id}
                  to={`/timeline?id=${journey.id}`}
                  className="group bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 block cursor-pointer"
                >
                  <div className="relative h-40">
                    <PlaceImage 
                      placeName={journey.checkpoints?.[0]?.name || journey.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {journey.status || "draft"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                        {journey.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <button 
                          className="p-1 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/plan?edit=${journey.id}`);
                          }}
                          title="Edit Trip"
                        >
                          <span className="material-icons text-xl">edit</span>
                        </button>
                        <button 
                          className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" 
                          onClick={(e) => handleDelete(e, journey.id)}
                          title="Delete Trip"
                        >
                          <span className="material-icons text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-base">
                          calendar_today
                        </span>
                        <span>{journey.dateRange || "Dates TBA"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-base">group</span>
                        <span>{journey.travelers || 1}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Budget
                      </div>
                      <div className="font-bold text-slate-800 dark:text-white bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm">
                        {journey?.budget?.total
                          ? `${getCurrencySymbol(journey.budget.currency || preferredCurrency)} ${journey.budget.total}`
                          : journey?.budget?.perDay
                            ? `${getCurrencySymbol(journey.budget.currency || preferredCurrency)} ${journey.budget.perDay}/day`
                            : "N/A"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {!loading && !error && journeys.length > 0 && (
                <Link
                  to="/plan"
                  className="group flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-primary group-hover:text-white text-slate-400 flex items-center justify-center transition-colors mb-3">
                    <span className="material-icons text-3xl">add</span>
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                    Plan New Trip
                  </span>
                  <span className="text-sm text-slate-400 mt-1">
                    Start your next adventure
                  </span>
                </Link>
              )}
            </div>

            {/* Legacy Features / Travel Tools Access */}
            <div className="mt-10 bg-white dark:bg-slate-800/80 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons-outlined text-primary text-2xl">luggage</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Interactive Packing List
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                    Ensure you never forget your passport or phone charger again. Use our interactive checklist tool to prepare for your journey.
                  </p>
                </div>
              </div>
              <Link 
                to="/travel-tools" 
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 text-sm rounded-lg font-bold transition-transform hover:-translate-y-1 shadow-md whitespace-nowrap flex items-center gap-2"
              >
                Launch Tool
                <span className="material-icons-outlined text-sm">open_in_new</span>
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
