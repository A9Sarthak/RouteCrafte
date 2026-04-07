import { Link } from 'react-router-dom';
import PlaceImage from '../components/PlaceImage';

export default function JourneySummary() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display transition-colors duration-200 min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <span className="material-icons text-primary text-3xl">map</span>
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">RouteCraft</span>
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</Link>
                <Link to="/plan" className="border-primary text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Plan Trip</Link>
                <a href="#" className="border-transparent text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Community</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-icons-outlined">notifications</span>
              </button>
              <Link to="/dashboard" className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                <img alt="User avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEwPaZ8GJhhbS7WBzbc7XvBuoXxPszlrTYOPvpTQSqsqW6g4kEJR9TVQKNKOBbXQdKIgZQ7aeWMc2EwUiBsibsXvZ-D3vRDfg91GA46HhQZUpKwPGJOjsJ5MS3UoIM5nNJHcpk30zJkJckp8nG9OCevkD69oOKDN6hh0pck4C_h-kttMjbf0MB02x0UkqKt4KkTkXoJA1L9zCPVud8PVpDkjcxvJmspsD9GxjFVwtCypQn4tXvH2MSvPR25NdWFr4Lli268NfLS-kK" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumbs & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav aria-label="Breadcrumb" className="flex text-sm text-slate-500 dark:text-slate-400 mb-2">
                <ol className="flex items-center space-x-2">
                  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><span className="material-icons text-xs">chevron_right</span></li>
                  <li><Link to="/plan" className="hover:text-primary transition-colors">Plan</Link></li>
                  <li><span className="material-icons text-xs">chevron_right</span></li>
                  <li aria-current="page" className="text-primary font-medium">Summary</li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Journey Final Summary</h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Review your itinerary for the <span className="font-semibold text-primary">"Summer Euro-Trip 2024"</span>.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                Ready for Booking
              </span>
            </div>
          </div>

          {/* Horizontal Visual Timeline */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <div className="min-w-[700px] py-4 px-4 relative">
              {/* Progress Bar Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-[85%] h-1 bg-primary -translate-y-1/2 z-0 rounded-full opacity-50"></div>
              <div className="flex justify-between items-center relative z-10 w-full">
                {/* Step 1: Start */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg ring-4 ring-background-light dark:ring-background-dark mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-lg">flight_takeoff</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">London</p>
                    <p className="text-xs text-slate-500">Oct 10</p>
                  </div>
                </div>
                {/* Step 2: Checkpoint */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-primary flex items-center justify-center text-primary shadow-lg ring-4 ring-background-light dark:ring-background-dark mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-sm">local_cafe</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Paris</p>
                    <p className="text-xs text-slate-500">Oct 12</p>
                  </div>
                </div>
                {/* Step 3: Checkpoint */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-primary flex items-center justify-center text-primary shadow-lg ring-4 ring-background-light dark:ring-background-dark mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-sm">museum</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rome</p>
                    <p className="text-xs text-slate-500">Oct 15</p>
                  </div>
                </div>
                {/* Step 4: Destination */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg ring-4 ring-background-light dark:ring-background-dark mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-lg">flag</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Athens</p>
                    <p className="text-xs text-slate-500">Oct 20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Detailed Itinerary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-icons-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Duration</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">10 Days</p>
                  </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <span className="material-icons-outlined">straighten</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Distance</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">2,450 km</p>
                  </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="material-icons-outlined">account_balance_wallet</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Budget</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">$2,450</p>
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Itinerary Details</h3>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                    <span className="material-icons text-base">file_download</span> Export PDF
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-900/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Location / Segment</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider" scope="col">Cost</th>
                        <th className="relative px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-slate-200 dark:divide-slate-800">
                      {/* Row 1 */}
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded-lg overflow-hidden">
                              <PlaceImage placeName="London" className="h-10 w-10 object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">London to Paris</div>
                              <div className="text-xs text-slate-500">Departure</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            <span className="material-icons text-xs mr-1">flight</span> Flight
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          Oct 10, 08:00 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                          $180
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-primary"><span className="material-icons text-lg">more_vert</span></button>
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded-lg overflow-hidden">
                              <PlaceImage placeName="Paris" className="h-10 w-10 object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">Paris Stay</div>
                              <div className="text-xs text-slate-500">Le Grand Hotel</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            <span className="material-icons text-xs mr-1">hotel</span> Stay
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          Oct 10 - Oct 12
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                          $450
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-primary"><span className="material-icons text-lg">more_vert</span></button>
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400">
                              <span className="material-icons text-xl">train</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">Paris to Rome</div>
                              <div className="text-xs text-slate-500">TGV High Speed</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            <span className="material-icons text-xs mr-1">train</span> Train
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          Oct 12, 10:00 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                          $120
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-primary"><span className="material-icons text-lg">more_vert</span></button>
                        </td>
                      </tr>
                      {/* Row 4 */}
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded-lg overflow-hidden">
                              <PlaceImage placeName="Rome" className="h-10 w-10 object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">Rome Stay</div>
                              <div className="text-xs text-slate-500">Airbnb Central</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            <span className="material-icons text-xs mr-1">hotel</span> Stay
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          Oct 12 - Oct 15
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                          $300
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-primary"><span className="material-icons text-lg">more_vert</span></button>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-900/30">
                      <tr>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right" colSpan="3">Total Estimated Cost:</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-primary text-lg">$2,450</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Map & Quick Actions */}
            <div className="space-y-6">
              {/* Map Preview Card */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden h-64 lg:h-80 relative group">
                <img alt="Map Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGG4bFaQLISWSkNk2PIZXK3-KMpjYK7cUL46437y8f4fdrYpaek7X6ZJI2DVnu1fErQct5L4qmd65It98YajSm7-X8I_3NfSDiwQeJ6bUt3KOuYGaoBUmQHTs_bscoYnF05WnzMdcXpWMXHBdJw5j7wYC0QEUeeSTjUqpIB1Do-MkwjaTNzUNGZdoE-aTE7ba9_fb_Qw_atUjyMumDYkxKEhpBNbDbnLuvH9g19Ly9AVBRz76brZS0JlL3Tsvh44ph37NezSRkg6Lc" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Route Visualization</h3>
                    <p className="text-slate-300 text-sm mb-3">View full interactive map with waypoints.</p>
                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm py-2 px-4 rounded-lg transition-colors border border-white/30">
                      Expand Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Trip Notes</h3>
                  <button className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-icons text-yellow-500 text-base mt-0.5">lightbulb</span>
                    Remember to pack universal power adapters for UK and EU.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-icons text-red-400 text-base mt-0.5">warning</span>
                    Check visa requirements for non-EU passport holders.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-icons text-primary text-base mt-0.5">confirmation_number</span>
                    Museum passes in Paris need to be booked 48h in advance.
                  </li>
                </ul>
              </div>

              {/* Weather Summary */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Weather Forecast</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="material-icons-outlined text-slate-400">cloud</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">London</p>
                        <p className="text-xs text-slate-500">Oct 10</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">14°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="material-icons-outlined text-yellow-500">wb_sunny</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Rome</p>
                        <p className="text-xs text-slate-500">Oct 15</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">22°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Action Bar */}
      <div className="sticky bottom-0 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] py-4 px-4 mt-8 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 hidden sm:block">
            Last saved: Just now
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium text-sm transition-colors">
              Reset Plan
            </button>
            <Link to="/timeline" className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary font-medium text-sm transition-colors flex items-center justify-center gap-2">
              <span className="material-icons text-sm">edit</span>
              Edit Journey
            </Link>
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2">
              <span className="material-icons text-sm">print</span>
              Print / Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
