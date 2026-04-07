import { useState, useEffect, useRef } from "react";

export default function LocationAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  placeholder, 
  icon = "place",
  type = "city",
  context = "", // 'context' is passing city to help Checkpoint search e.g. 'Paris'
  className = ""
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      // Append context if it's a checkpoint search
      let searchQuery = searchTerm;
      if (type === "checkpoint" && context) {
         if (!searchQuery.toLowerCase().includes(context.toLowerCase())) {
            searchQuery = `${searchQuery}, ${context}`;
         }
      }

      // featuretype helps restricted search
      let featureQuery = "";
      if (type === "city") featureQuery = "&featuretype=city";

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}${featureQuery}&limit=5`);
      const data = await res.json();
      
      const formatted = data.map(item => ({
        name: item.display_name.split(",")[0],
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type
      }));
      setResults(formatted);
    } catch (err) {
      console.error("Autocomplete search error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setOpen(true);
    setLoading(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      searchLocations(val);
    }, 600); // 600ms debounce
  };

  const handleSelect = (result) => {
    const displayName = result.name;
    setQuery(displayName);
    onChange(displayName);
    setOpen(false);
    if (onSelect) onSelect(result);
  };

  return (
    <div className="relative group/input" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className={`material-icons-outlined text-xl ${type === 'city' ? 'text-primary' : 'text-slate-400'}`}>
            {icon}
          </span>
        </div>
        <input
          className={`block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow ${className}`}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          type="text"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="material-icons-outlined text-slate-400 animate-spin text-sm">refresh</span>
          </div>
        )}
      </div>

      {open && results.length > 0 && query.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fade-in-up">
          {results.map((res, i) => (
            <div 
              key={i}
              onClick={() => handleSelect(res)}
              className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b last:border-0 border-slate-100 dark:border-slate-700/50 flex flex-col gap-1 transition-colors"
            >
               <span className="font-bold text-sm text-slate-800 dark:text-white">{res.name}</span>
               <span className="text-[11px] text-slate-500 truncate">{res.fullName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
