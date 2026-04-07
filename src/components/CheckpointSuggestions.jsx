import { useState, useEffect } from "react";

export default function CheckpointSuggestions({ checkpointName, cityName, onAddSuggestion }) {
  const [suggestions, setSuggestions] = useState({ stay: [], eat: [], visit: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPOIs() {
      if (!checkpointName || checkpointName.trim().length < 3) return;
      
      setLoading(true);
      try {
        const queryContext = `${checkpointName}, ${cityName}`;
        
        // Fetch up to 3 options concurrently using Nominatim
        const [stayRes, eatRes, visitRes] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hotel+near+${encodeURIComponent(queryContext)}&limit=3`).then(r => r.json()),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=restaurant+near+${encodeURIComponent(queryContext)}&limit=3`).then(r => r.json()),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=attraction+near+${encodeURIComponent(queryContext)}&limit=3`).then(r => r.json())
        ]);

        if (isMounted) {
          setSuggestions({
            stay: stayRes.map(r => r.display_name.split(',')[0]),
            eat: eatRes.map(r => r.display_name.split(',')[0]),
            visit: visitRes.map(r => r.display_name.split(',')[0])
           });
        }
      } catch (err) {
        console.error("Osm search fail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Debounce the call to avoid API spanning while typing the checkpoint
    const t = setTimeout(() => {
      fetchPOIs();
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [checkpointName, cityName]);

  if (!checkpointName || checkpointName.trim().length < 3) return null;

  return (
    <div className="mt-4 pl-3 border-l-2 border-primary/50 text-xs text-slate-500 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-2">
         <span className="font-semibold text-slate-600 dark:text-slate-400">
           Realtime Ideas near {checkpointName.trim()}:
         </span>
         {loading && <span className="material-icons-outlined text-slate-400 animate-spin text-[12px]">refresh</span>}
      </div>
      <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar scroll-smooth flex-wrap">
        {suggestions.stay.map((place, idx) => (
          <span 
            key={`stay-${idx}`}
            onClick={() => onAddSuggestion(place)}
            className="whitespace-nowrap bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-2 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <span className="material-icons-outlined text-[16px]">hotel</span> {place}
          </span>
        ))}
        {suggestions.eat.map((place, idx) => (
          <span 
            key={`eat-${idx}`}
            onClick={() => onAddSuggestion(place)}
            className="whitespace-nowrap bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-2 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <span className="material-icons-outlined text-[16px]">restaurant</span> {place}
          </span>
        ))}
        {suggestions.visit.map((place, idx) => (
          <span 
            key={`visit-${idx}`}
            onClick={() => onAddSuggestion(place)}
            className="whitespace-nowrap bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-2 rounded-md flex items-center gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50 hover:-translate-y-0.5 transition-all shadow-sm"
          >
            <span className="material-icons-outlined text-[16px]">camera_alt</span> {place}
          </span>
        ))}
        {!loading && suggestions.stay.length === 0 && suggestions.eat.length === 0 && suggestions.visit.length === 0 && (
          <span className="text-slate-400 italic">No exact amenities found immediately nearby.</span>
        )}
      </div>
    </div>
  );
}
