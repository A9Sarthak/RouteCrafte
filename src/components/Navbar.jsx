import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.theme || 'light');
  const [isAnimating, setIsAnimating] = useState(false);
  const [airlineTheme, setAirlineTheme] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setAirlineTheme(newTheme);

    setTimeout(() => {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      }
      setTheme(newTheme);
    }, 1500);

    setTimeout(() => {
      setIsAnimating(false);
      setAirlineTheme(null);
    }, 3000);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-icons-round text-xl">map</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              RouteCraft
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/overview"
                  className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
                >
                  Overview
                </Link>
              </>
            )}
            <Link
              to="/plan"
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Plan Journey
            </Link>
            <Link
              to="/contact"
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Contact
            </Link>

            {!isAuthenticated && (
              <a
                href="#about"
                className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                About
              </a>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors focus:outline-none bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <span className="material-icons-outlined">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center justify-center p-1 rounded-full border-2 border-transparent hover:border-primary transition-all focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                    {user?.profile?.avatar ? (
                      <img src={user.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons-round text-primary">person</span>
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-12 right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                       <span className="material-icons-outlined text-lg">manage_accounts</span> Edit Profile
                    </Link>
                    <Link to="/overview" onClick={() => setDropdownOpen(false)} className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                       <span className="material-icons-outlined text-lg">bookmark</span> Saved Locations
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3">
                       <span className="material-icons-outlined text-lg">logout</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-primary focus:outline-none"
            >
              <span className="material-icons-round text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
                <Link to="/overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Overview</Link>
              </>
            )}
            <Link to="/plan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Plan Journey</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Contact</Link>

            {!isAuthenticated ? (
              <>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">About</a>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Log in</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-slate-100 dark:hover:bg-slate-800">Sign up</Link>
              </>
            ) : (
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">Sign Out</button>
            )}
            <button onClick={() => { setMobileMenuOpen(false); toggleTheme(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between mt-2">
              <span>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
              <span className="material-icons-outlined text-xl">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
            </button>
          </div>
        </div>
      )}

      {isAnimating && airlineTheme && (
        <div className="fixed inset-[0] w-screen h-screen pointer-events-none z-[9999] overflow-hidden">
          <span 
            className={`material-icons-round text-primary drop-shadow-2xl opacity-0 ${
              airlineTheme === 'dark' ? 'animate-fly-dark' : 'animate-fly-light'
            }`}
          >
            flight
          </span>
        </div>
      )}
    </nav>
  );
}
