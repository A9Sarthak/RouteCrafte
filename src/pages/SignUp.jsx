import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.fullname.trim().length < 2) {
      setError("Full Name must be at least 2 characters long.");
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
      await register({
        name: form.fullname,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to sign up");
    }
  };

  return (
    <div className="min-h-screen flex font-display bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-16 md:px-24 relative z-10 bg-white dark:bg-[#0f172a] overflow-y-auto py-12">
        
        {/* Top Logo */}
        <div className="lg:absolute top-8 left-6 sm:left-12 lg:left-16 mb-8 lg:mb-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary text-white p-2 rounded-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-icons text-xl">map</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              RouteCraft
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Create an account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Design your perfect journey, start to finish.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="fullname">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-icons text-[18px]">person_outline</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  id="fullname"
                  name="fullname"
                  placeholder="e.g. Amelia Earhart"
                  required
                  minLength="2"
                  type="text"
                  value={form.fullname}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-icons text-[18px]">mail_outline</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-icons text-[18px]">lock_outline</span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  id="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  required
                  minLength="8"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="material-icons text-[18px]">error_outline</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-sky-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? "Creating account..." : "Start Your Journey"}
            </button>
          </form>



          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?
            <Link to="/login" className="text-primary hover:text-sky-500 transition-colors ml-1.5 font-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex w-1/2 xl:w-[55%] relative p-4 lg:p-6 lg:pl-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src="/images/signup-hero.jpg" 
            alt="Airplane wing over clouds" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 z-20 p-12 xl:p-16 pb-16">
            <h2 className="text-4xl text-white font-extrabold leading-tight mb-4 tracking-tight drop-shadow-md">
              Discover the world,<br/>one route at a time.
            </h2>
            <p className="text-slate-200 text-lg max-w-md font-medium drop-shadow-sm">
              Join thousands of travelers who use RouteCraft to plan, budget, and map their dream destinations seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
