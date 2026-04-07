import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email) {
      setError("Please enter your email address.");
      return;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to sign in");
    }
  };

  return (
    <div className="min-h-screen flex font-display bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col px-6 sm:px-16 md:px-24 relative z-10 bg-white dark:bg-[#0f172a]">
        
        {/* Top Logo */}
        <div className="mt-8 mb-auto">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary text-white p-2 rounded-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-icons text-xl">map</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              RouteCraft
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please enter your details to sign in and access your saved routes.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-icons text-slate-400 text-[18px]">mail_outline</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all sm:text-sm"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-icons text-slate-400 text-[18px]">lock_outline</span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all sm:text-sm"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="material-icons text-[18px]">error_outline</span>
                <span>{error}</span>
              </div>
            )}

            <button
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-sky-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign In to RouteCraft"}
              {!authLoading && <span className="material-icons text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?
            <Link to="/signup" className="text-primary hover:text-sky-500 transition-colors ml-1.5 font-bold">
              Create an account
            </Link>
          </p>
        </div>
        <div className="mt-auto pb-8"></div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex w-1/2 xl:w-[55%] relative p-4 lg:p-6 lg:pl-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-primary/60 mix-blend-multiply z-10"></div>
          <img 
            src="/images/login-hero.jpg" 
            alt="Beautiful travel scenery" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 xl:p-16 pb-16">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-lg shadow-xl shadow-black/30">
              <h2 className="text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-sm">
                Map your next great <span className="text-sky-300">adventure.</span>
              </h2>
              <p className="text-sky-50 text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
                RouteCraft helps you organize and beautifully visualize every step of your journey around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
