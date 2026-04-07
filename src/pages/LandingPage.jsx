import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {!isAuthenticated && (
        <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white"><span className="material-icons-round text-xl">map</span></div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">RouteCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 font-semibold text-sm hover:text-primary transition-colors">Log In</Link>
            <Link to="/signup" className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Sign Up</Link>
          </div>
        </header>
      )}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <span className="material-icons-round text-sm">explore</span>
                Explore the world smarter
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
                Plan Your Journey <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">
                  Visually.
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Experience the easiest way to map your travels. RouteCraft helps
                you build itineraries, manage budgets, and discover hidden gems
                along the way—all in one visual workspace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-primary hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 group"
                  >
                    Go to Dashboard
                    <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/plan"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-primary hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 group"
                  >
                    Start Planning Now
                    <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                )}
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex -space-x-2">
                  <img
                    alt="User Avatar 1"
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeSUzoantPzgCeUNsz_dIrV6cGzAQWZPYtnr6FZPSoVczPd3FERvjmUPs_tsOU2ijSN7_Q5-dZh8wAd0UjLpCvIqJQm8SKo3K1jmYZuhv3EbPipC0uMyvjHpRicLWJEIarChbpn0cNPpWLjmvDOZMV-sRokKaR7x8TQv6-CtIa0ZwNDsSx5Cvwc0q-JTvYT4_FNze1sZ1LTY15zxko-TqDVZ7jSWvswEsKzG3JdHIrF63igd-_Uz2aXdbtHTp-AUXKCpxZhqCn4vPi"
                  />
                  <img
                    alt="User Avatar 2"
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFOGHBsczo147MCzqbj-0Vcx4DZQZ7Mdeibcm-Vy1Hj-5lDGOPPfjBi7VtkJFzGMOctjeNb8uRffjSAUn26CYkVf9O607jtPe5751PGCGLIs6FZdEdtq5QxhRRuZ9y1FQ1yL1fN1-8c60Lxh9E1Re_IAAKGBGIDthB3hcKJ3OfkqQgd9wtVLgU0NAewno8Z339tNCiMm5hBGjl4kYMMnNnvqlkgLLs4jpyKFtVXD0jb2MiubfhyHsVGM7gvt3ePOEJRgWg9_8LATCs"
                  />
                  <img
                    alt="User Avatar 3"
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWkI-OFsz6ZL0Bgxg-dJ3a7d00kNqqMdxyZ1fKNdxEg8th8Xm-yJujqls-_YwOE6hcOi_V4xfDZ3D1ftiOnVEqUOCWRtooFUqKsttwBbYZeKmyeo6E9MZeYuyjew9njuOCApiwR9QEoZqNs5a0z45WFmknjgXOVd8BEvvd_lO93_sjQMOkCT6jDhLDYAc8weRxNpdq-OhLjUI20i1aNs-MsBoROmXwYv9RinQqyF-8qlVDcEDITZP3a7mSpTEzVeDYdmRKIs5IRZD3"
                  />
                </div>
                <p>Trusted by 10,000+ travelers</p>
              </div>
            </div>
            <div className="relative lg:ml-auto w-full max-w-lg lg:max-w-none">
              <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 z-10 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <span className="material-icons-round">
                        flight_takeoff
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Summer Roadtrip
                      </h3>
                      <p className="text-xs text-slate-500">
                        Aug 15 - Aug 28 • 4 Travelers
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="material-icons-round text-slate-400 text-sm">
                      share
                    </span>
                    <span className="material-icons-round text-slate-400 text-sm">
                      more_horiz
                    </span>
                  </div>
                </div>
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6 bg-slate-100 dark:bg-slate-900">
                  <img
                    alt="Map of scenic route"
                    className="w-full h-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI2N5jAHATo88PbjE7phETOy8_aqTXHAwLinSwIhjkrFF-_w_vX7ACr3DeJT0it-tZKl2rJSM4y96ImP7wBsnOCCN9Gban1cUjUN_nBg3axOXCEPHXzCHpMl-5jhnTMAkAWc9cfhF9btOp8MSU0Zm5RDOa7MBghJgLbEXKgq4pisj-P0pkkQWNePd9ZKX1_bPs4n29hDagZFZiYq9Bt92boe-SQGspXjskvA0NHk6HNoCr5HO3O5h28QODmazOva31n7arHy0qHp27"
                  />
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-white dark:ring-slate-800 shadow-lg animate-pulse"></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Point
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <div className="w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg"></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap">
                      Lunch Stop
                    </div>
                  </div>
                  <svg
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 120 70 Q 250 100 350 130"
                      fill="none"
                      stroke="#13a4ec"
                      strokeDasharray="6 4"
                      strokeWidth="3"
                    ></path>
                  </svg>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-3 font-bold text-sm">
                      01
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Zurich City Center
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sightseeing • 2h
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary group-hover:underline">
                      Edit
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center mr-3 font-bold text-sm">
                      02
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Lake Lucerne
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Relaxation • 3h
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary group-hover:underline">
                      Edit
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-dashed border-primary/20 rounded-xl"></div>
              <div
                className="absolute z-20 -bottom-5 -left-5 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                    <span className="material-icons-round text-sm">
                      savings
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Budget Saved</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      $120.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white dark:bg-slate-900 relative" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
              Why RouteCraft?
            </h2>
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for the perfect trip
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              We've combined the power of maps, calendars, and spreadsheets into
              one intuitive interface.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-700 -z-10"></div>
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-soft transition-all duration-300 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons-round text-primary text-2xl">
                  timeline
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">
                Visual Timeline Planning
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Drag and drop your stops to create the perfect flow. Visualize
                travel times and overlapping activities effortlessly.
              </p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-soft transition-all duration-300 group relative">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons-round text-primary text-2xl">
                  account_balance_wallet
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">
                Budget-Based Suggestions
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Input your total budget and let our smart engine recommend
                accommodations and activities that fit your wallet.
              </p>
            </div>
            <div className="bg-background-light dark:bg-background-dark p-8 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-soft transition-all duration-300 group">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons-round text-primary text-2xl">
                  near_me
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">
                Nearby Recommendations
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Never miss out. Find best-rated spots, hidden cafes, and scenic
                viewpoints near your route instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-cyan-400 rounded-xl p-10 md:p-16 text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg
                height="100%"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <pattern
                  height="40"
                  id="grid"
                  patternUnits="userSpaceOnUse"
                  width="40"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  ></path>
                </pattern>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Ready to map your next adventure?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of travelers who are planning smarter, not harder.
              Get started for free today.
            </p>
            <Link
              to="/plan"
              className="bg-white text-primary hover:bg-slate-50 font-bold py-4 px-10 rounded-lg shadow-lg transition-transform hover:-translate-y-1 relative z-10 text-lg block w-max mx-auto"
            >
              Plan Your Journey Free
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
