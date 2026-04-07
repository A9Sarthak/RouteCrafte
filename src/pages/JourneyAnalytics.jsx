import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJourneys, updateJourney, shareJourney } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical React-Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultIcon = new L.Icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const visitedIcon = new L.DivIcon({
  className: 'custom-visited-marker',
  html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><span class="material-icons-outlined" style="font-size: 16px;">check</span></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function JourneyAnalytics() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJourneys().then(res => {
      const found = res.journeys.find(j => j.id === id);
      setJourney(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleCompleteTrip = async () => {
    const newStatus = journey.status === 'completed' ? 'planned' : 'completed';
    try {
      const res = await updateJourney(journey.id, { status: newStatus });
      setJourney(res.journey);
    } catch(err) {
      console.error(err);
    }
  };

  const handleShareTrip = async () => {
    const targetEmail = window.prompt("Enter destination email address to share this itinerary:");
    if (!targetEmail) return;
    try {
      const res = await shareJourney(journey.id, targetEmail);
      if (res.preview) {
        console.log("Email Preview URL:", res.preview);
        alert("Trip Successfully Shared! (Check terminal/console for ethereal mail link)");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to share trip.");
    }
  };

  const mapCenter = useMemo(() => {
    if (journey?.checkpoints?.length > 0) {
      return [journey.checkpoints[0].lat, journey.checkpoints[0].lng];
    }
    return [48.8566, 2.3522]; // Default Paris
  }, [journey]);

  const polylinePositions = useMemo(() => {
    return journey?.checkpoints?.map(c => [c.lat, c.lng]) || [];
  }, [journey]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading trip details...</div>;
  if (!journey) return <div className="p-8 text-center text-red-500">Trip not found.</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <nav aria-label="Breadcrumb" className="flex mb-4">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="inline-flex items-center hover:text-primary transition-colors">
                <Link to="/" className="inline-flex items-center font-medium">Home</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-icons-outlined text-lg mx-1">chevron_right</span>
                  <Link to="/dashboard" className="hover:text-primary transition-colors font-medium">My Trips</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-icons-outlined text-lg mx-1">chevron_right</span>
                  <span className="text-primary font-medium">{journey.title}</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{journey.title || "Trip Overview"}</h1>
                {journey.status === 'completed' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm rounded-full flex items-center gap-1">
                    <span className="material-icons-outlined text-sm">check_circle</span>
                    Completed
                  </span>
                )}
              </div>
              <p className="mt-2 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">calendar_today</span>
                {journey.dateRange || "Dates TBA"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
               <button 
                onClick={handleCompleteTrip}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all transform hover:-translate-y-0.5 ${journey.status === 'completed' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600' : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/30'}`}
               >
                  <span className="material-icons-outlined text-lg">{journey.status === 'completed' ? 'undo' : 'done_all'}</span>
                  {journey.status === 'completed' ? 'Mark Planned' : 'Mark Complete'}
               </button>
               <button 
                onClick={handleShareTrip}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-purple-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-600 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5"
               >
                  <span className="material-icons-outlined text-lg">forward_to_inbox</span>
                  Share Via Email
               </button>
              <Link to={`/timeline?id=${journey.id}`} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/30 hover:bg-sky-500 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                <span className="material-icons-outlined text-lg">timeline</span>
                View Timeline
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <div className={`group relative bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden ${!(journey.budget?.total || journey.budget?.initialTotal) ? 'md:col-span-2' : ''}`}>
             <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Checkpoints</p>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{journey.checkpoints?.length || 0} <span className="text-2xl font-semibold text-slate-500">Stops</span></h3>
              </div>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-icons-outlined text-3xl">place</span>
              </div>
             </div>
          </div>

          {(journey.budget?.total || journey.budget?.initialTotal) && (
            <div className="group relative bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 overflow-hidden">
               <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Budget</p>
                  <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{journey.budget?.currency === 'USD' ? '$' : '₹'}{journey.budget?.total || 0}</h3>
                </div>
                <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="material-icons-outlined text-3xl">account_balance_wallet</span>
                </div>
               </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 relative h-[500px] w-full z-10">
          <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {journey.checkpoints?.map((point, index) => (
              point?.lat && point?.lng && (
                <Marker key={`${point.name}-${index}`} position={[point.lat, point.lng]} icon={point.visited ? visitedIcon : defaultIcon}>
                  <Popup>
                    <div className="font-bold text-base">{point.name}</div>
                    {point.visited ? (
                      <div className="text-green-600 text-sm font-semibold flex items-center gap-1 mt-1">
                        <span className="material-icons-outlined" style={{fontSize: '14px'}}>check_circle</span> 
                        Visited
                      </div>
                     ) : (
                      <div className="text-slate-500 text-sm mt-1">
                        Planned Stop
                      </div>
                     )}
                  </Popup>
                </Marker>
              )
            ))}
            {polylinePositions.length > 1 && (
              <Polyline positions={polylinePositions} color="blue" weight={3} opacity={0.7} />
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
