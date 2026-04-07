import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getJourneys, updateJourney, deleteJourney } from '../services/api';
import PlaceImage from '../components/PlaceImage';
import { useAuth } from '../context/AuthContext';

function DestinationAccordion({ 
  city, baseBudget, index, previousCity, currencySym, 
  onToggleVisited, onAddCheckpoint, onUpdateDestination, onUpdateCheckpoint, errorFieldId 
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    let active = true;
    if (expanded && !fetched) {
       setLoading(true);
       let pq = city.name;
       if (city.subCheckpoints && city.subCheckpoints.length > 0) {
          pq = `${city.subCheckpoints[0].name}, ${city.name}`;
       }
       Promise.all([
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hotel+near+${encodeURIComponent(pq)}&limit=2`).then(r=>r.json()),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=restaurant+near+${encodeURIComponent(pq)}&limit=2`).then(r=>r.json()),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=attraction+near+${encodeURIComponent(pq)}&limit=2`).then(r=>r.json()),
       ]).then(([hotels, eats, visits]) => {
          if (!active) return;
          const mapToPOI = (arr, category) => arr.map(i => ({ 
             category, 
             name: i.display_name.split(',')[0], 
             full: i.display_name, 
             lat: parseFloat(i.lat), 
             lng: parseFloat(i.lon) 
          }));
          
          setPois([...mapToPOI(hotels, 'stay'), ...mapToPOI(eats, 'eat'), ...mapToPOI(visits, 'visit')]);
          setLoading(false);
          setFetched(true);
       }).catch(err => {
          console.error("Timeline POI fetch failed:", err);
          if (active) { setLoading(false); setFetched(true); }
       });
    }
    return () => { active = false; };
  }, [expanded, city.name, fetched]);
  
  return (
    <div className="mb-6 mt-12 relative z-10 transition-all">
      
      {/* Destination Node on timeline */}
      <div className="absolute top-[34px] w-5 h-5 rounded-full border-4 border-primary bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm z-20" style={{ left: '-38px' }}>
         <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
      </div>

      {/* Transport Pill on timeline string */}
      <div className="absolute top-[-38px] z-30 flex items-center gap-3" style={{ left: '-34px' }}>
         <div className="w-3 h-3 rounded-full border-2 border-primary bg-white dark:bg-slate-900 flex-shrink-0"></div>

         <div className="flex flex-row bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/80 shadow-md rounded-full py-1 px-4 items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 max-w-[100px] truncate" title={previousCity ? `Travel from ${previousCity}` : "Travel from Home"}>
               {previousCity ? `From ${previousCity}` : "From Home"}
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <select
               value={city.transport || "Flight"}
               onChange={(e) => onUpdateDestination(city.id, 'transport', e.target.value, true)}
               className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer focus:text-primary max-w-[90px]"
            >
               <option value="Flight">✈️ Flight</option>
               <option value="Train">🚆 Train</option>
               <option value="Bus">🚌 Bus</option>
               <option value="Car">🚗 Car</option>
               <option value="Ferry">⛴️ Ferry</option>
            </select>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center">
              <span className="text-xs text-slate-400 font-bold mr-1">{currencySym}</span>
              <input
                 type="number"
                 value={city.cost || ""}
                 placeholder="0"
                 min="0"
                 onChange={(e) => {
                    const success = onUpdateDestination(city.id, 'cost', e.target.value, false);
                    if (success === false) e.target.value = city.cost || "";
                 }}
                 onBlur={(e) => onUpdateDestination(city.id, 'cost', e.target.value, true)}
                 className="w-16 text-xs font-mono font-bold bg-transparent outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
              />
            </div>
            {errorFieldId === city.id && (
               <div className="absolute -top-8 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm animate-fade-in flex items-center gap-1 border border-red-200 z-50">
                  <span className="material-icons-outlined text-[12px]">error</span> Exceeds Limit
               </div>
            )}
         </div>
      </div>

      <div 
        className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group lg:p-6"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-icons-outlined">where_to_vote</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{city.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{city.subCheckpoints?.length || 0} Checkpoints added</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {city.subCheckpoints?.every(c => c.visited) && city.subCheckpoints?.length > 0 && (
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 flex items-center gap-1 rounded-full font-bold">
                 <span className="material-icons text-[12px]">done_all</span> Done
              </span>
           )}
           <button className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180 bg-primary/10 text-primary' : 'text-slate-500'}`}>
             <span className="material-icons-outlined">expand_more</span>
           </button>
        </div>
      </div>
      
      {expanded && (
         <div className="mt-4 ml-6 pl-8 border-l-[3px] border-primary/20 dark:border-primary/10 space-y-5 animate-fade-in-up pb-4">
            
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
               <div className="flex items-center justify-between mb-3">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                   <span className="material-icons flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm">auto_awesome</span> 
                   Live Places in {city.name}
                 </h4>
                 {loading && <span className="material-icons-outlined text-blue-400 animate-spin text-[16px]">refresh</span>}
               </div>

               <p className="text-xs text-slate-500 mb-4 italic">Clicking on any of these real locations automatically adds them to your checkpoints below.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {pois.map((poi, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onAddCheckpoint(city.id, poi)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                    >
                       <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${poi.category === 'stay' ? 'text-blue-500' : poi.category === 'eat' ? 'text-orange-500' : 'text-green-600'}`}>{poi.category}</p>
                       <p className="font-bold text-slate-800 dark:text-white text-sm mb-1 leading-snug truncate">{poi.name}</p>
                       <p className="text-[10px] text-slate-400 truncate w-full">{poi.full}</p>
                       <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1"><span className="material-icons-round text-[12px] text-green-500">verified</span> real place</span>
                          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 text-primary transition-opacity font-bold"><span className="material-icons-outlined text-[12px]">add_circle</span> Add to Trip</span>
                       </div>
                    </div>
                 ))}
                 {!loading && pois.length === 0 && (
                    <div className="col-span-full text-slate-500 text-sm py-2">No live suggestions found right now.</div>
                 )}
               </div>
            </div>

            <div className="relative mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 ml-6">Planned Checkpoints</h4>
              {city.subCheckpoints?.length > 0 && (
                 <div className="absolute left-[34px] top-6 bottom-[0px] w-[2px] border-l-2 border-dashed border-slate-300 dark:border-slate-600 z-0"></div>
              )}
              {city.subCheckpoints?.length > 0 ? (
                 <div className="pl-[56px] relative z-10 pb-4">
                   {city.subCheckpoints.map((cp, idx) => (
                     <div key={cp.id} className="relative mt-12">
                       {/* Checkpoint Transport Pill Layer */}
                       <div className="absolute top-[-40px] left-[-25px] z-20 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full border border-slate-400 bg-white dark:bg-slate-800 flex-shrink-0"></div>

                          <div className="flex flex-row bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full py-0.5 px-3 items-center gap-2">
                             <select
                               value={cp.transport || "Walk"}
                               onChange={(e) => onUpdateCheckpoint(city.id, cp.id, 'transport', e.target.value, true)}
                               className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-transparent outline-none cursor-pointer focus:text-primary max-w-[70px]"
                             >
                               <option value="Walk">🚶 Walk</option>
                               <option value="Cab">🚕 Cab</option>
                               <option value="Transit">🚇 Transit</option>
                             </select>
                             <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
                             <div className="flex items-center">
                               <span className="text-[10px] text-slate-400 font-bold mr-1">{currencySym}</span>
                               <input 
                                 type="number"
                                 value={cp.cost || ""}
                                 placeholder="0"
                                 min="0"
                                 onChange={(e) => {
                                    const success = onUpdateCheckpoint(city.id, cp.id, 'cost', e.target.value, false);
                                    if (success === false) e.target.value = cp.cost || "";
                                 }}
                                 onBlur={(e) => onUpdateCheckpoint(city.id, cp.id, 'cost', e.target.value, true)}
                                 className="w-12 text-[10px] font-mono bg-transparent outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
                               />
                             </div>
                             {errorFieldId === cp.id && (
                                <div className="absolute -top-7 right-[-10px] bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded shadow-sm animate-fade-in flex items-center gap-1 border border-red-200 z-50 whitespace-nowrap">
                                   Exceeds Limit
                                </div>
                             )}
                          </div>
                       </div>

                       <div className={`flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md ${cp.visited ? 'opacity-60 bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                          <button 
                            onClick={() => onToggleVisited(city.id, cp.id)}
                            className={`w-7 h-7 flex-shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm relative z-20 ${cp.visited ? 'bg-green-500 border-green-500 text-white shadow-green-500/20' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-primary text-transparent'}`}
                          >
                            <span className="material-icons-outlined text-sm font-bold">check</span>
                          </button>
                          <div className="flex-1">
                            <h4 className={`font-bold text-base text-slate-800 dark:text-white ${cp.visited ? 'line-through text-slate-500' : ''}`}>{cp.name}</h4>
                            {cp.lat && cp.lng && (
                              <p className="text-xs text-slate-400 font-mono mt-1">Coord: {cp.lat.toFixed(4)}, {cp.lng.toFixed(4)}</p>
                            )}
                          </div>
                          <div className="w-16 h-12 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden hidden sm:block">
                            <PlaceImage placeName={`${cp.name} ${city.name}`} className="w-full h-full object-cover" />
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                 <p className="text-sm text-slate-500 italic px-6 mt-2">No checkpoints added for this destination.</p>
              )}

              {(() => {
                 const targetBudget = Number(city.cost) || 0;
                 const checkpointSum = (city.subCheckpoints || []).reduce((sum, cp) => sum + (Number(cp.cost) || 0), 0);
                 if (targetBudget > 0 && checkpointSum > targetBudget) {
                    return (
                      <div className="mx-6 mt-4 mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 relative z-10 transition-all">
                        <span className="material-icons-outlined text-red-500 mt-0.5 text-sm">warning</span>
                        <p className="text-xs text-red-700 dark:text-red-300 font-medium leading-relaxed">
                          You have allocated <strong>{currencySym}{checkpointSum.toLocaleString()}</strong> across locations here, which exceeds the destination limit of <strong>{currencySym}{targetBudget.toLocaleString()}</strong>.
                        </p>
                      </div>
                    );
                 }
                 return null;
              })()}
            </div>
         </div>
      )}
    </div>
  );
}

export default function JourneyTimeline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const reportRef = useRef(null);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [globalBudgetError, setGlobalBudgetError] = useState("");

  const preferredCurrency = user?.profile?.preferences?.currency || "USD";
  const journeyCurrency = journey?.budget?.currency || preferredCurrency;
  const currencySym = (() => {
    switch (journeyCurrency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR': return '₹';
      case 'USD': default: return '$';
    }
  })();

  const calculateTotalSpent = () => {
     return items.reduce((sum, city) => {
        const cpCost = (city.subCheckpoints || []).reduce((cSum, cp) => cSum + (Number(cp.cost) || 0), 0);
        return sum + cpCost;
     }, 0);
  };

  const generateReportText = () => {
    let text = `======================================\n`;
    text += `       TRIP REPORT: ${journey.title.toUpperCase()}\n`;
    text += `======================================\n`;
    text += `Dates: ${journey.dateRange || "TBA"}\n`;
    text += `Travelers: ${journey.travelers || 1}\n`;
    text += `Status: ${journey.status}\n`;
    const _userBudget = journey.budget?.initialTotal || journey.budget?.total;
    if (_userBudget) {
       text += `Budget Allocated: ${currencySym}${_userBudget}\n`;
    }
    text += `Total Estimated Cost: ${currencySym}${calculateTotalSpent()}\n\n`;
    text += `--- LOGISTICS & ITINERARY ---\n\n`;

    items.forEach((city, index) => {
       text += `Destination ${index + 1}: ${city.name}\n`;
       if (city.transport || city.cost) text += `[Transport: ${city.transport || 'N/A'} | Cost: ${currencySym}${city.cost || 0}]\n`;
       if (city.subCheckpoints && city.subCheckpoints.length > 0) {
          text += `Checkpoints:\n`;
          city.subCheckpoints.forEach(cp => {
             text += `  - ${cp.name} (Transport: ${cp.transport || 'N/A'}, Cost: ${currencySym}${cp.cost || 0})\n`;
          });
       } else {
          text += `  - No specific checkpoints planned yet.\n`;
       }
       text += `\n`;
    });
    
    text += `======================================\n`;
    text += `Generated securely via RouteCraft.\n`;
    return text;
  };

  const downloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RouteCraft_Report_${journey.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReportImage = async () => {
    if (!reportRef.current) return;
    setDownloadingImg(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
        scale: 2,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `RouteCraft_Report_${journey.title.replace(/\s+/g, '_')}.png`;
      a.click();
    } catch (err) {
      console.error("Failed generating image:", err);
    } finally {
      setDownloadingImg(false);
    }
  };

  useEffect(() => {
    getJourneys().then(res => {
      const found = res.journeys.find(j => j.id === id);
      setJourney(found || null);
      if (found && found.checkpoints) {
        if (found.checkpoints.length > 0 && found.checkpoints[0].type !== "city") {
           const converted = [{
             id: 'legacy-city',
             type: 'city',
             name: 'Full Trip Itinerary',
             subCheckpoints: found.checkpoints.map((cp, idx) => ({ ...cp, id: cp.id || `cp-${idx}` }))
           }];
           setItems(converted);
        } else {
           setItems(found.checkpoints);
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleToggleVisited = async (cityId, pointId) => {
    const updatedCheckpoints = items.map(city => {
      if (city.id === cityId) {
        return {
          ...city,
          subCheckpoints: (city.subCheckpoints || []).map(p => 
            p.id === pointId ? { ...p, visited: !p.visited } : p
          )
        };
      }
      return city;
    });
    setItems(updatedCheckpoints);
    try {
      await updateJourney(journey.id, { checkpoints: updatedCheckpoints });
      setJourney({ ...journey, checkpoints: updatedCheckpoints });
    } catch(err) {
      console.error(err);
    }
  };

  const handleUpdateDestinationDB = async (allItems) => {
    try {
      await updateJourney(journey.id, { checkpoints: allItems });
      setJourney({ ...journey, checkpoints: allItems });
    } catch(err) { console.error(err); }
  }

  const handleUpdateDestination = (cityId, field, value, saveToDb) => {
    const updated = items.map(c => c.id === cityId ? { ...c, [field]: value } : c);

    if (field === 'cost') {
       const userEnteredBudget = Boolean(journey?.budget?.initialTotal || journey?.budget?.total);
       const baseBudget = userEnteredBudget ? (journey.budget.initialTotal || journey.budget.total) : 0;
       
       if (userEnteredBudget) {
          const proposedTargetTotal = updated.reduce((sum, city) => sum + (Number(city.cost) || 0), 0);
          if (proposedTargetTotal > baseBudget) {
             setGlobalBudgetError(cityId);
             setTimeout(() => setGlobalBudgetError(""), 3000);
             return false;
          } else {
             setGlobalBudgetError("");
          }
       }
    }

    setItems(updated);
    if (saveToDb) handleUpdateDestinationDB(updated);
    return true;
  };

  const handleUpdateCheckpoint = (cityId, cpId, field, value, saveToDb) => {
    const updated = items.map(c => {
      if (c.id === cityId) {
        return {
          ...c,
          subCheckpoints: (c.subCheckpoints || []).map(cp => cp.id === cpId ? { ...cp, [field]: value } : cp)
        };
      }
      return c;
    });

    if (field === 'cost') {
       const userEnteredBudget = Boolean(journey?.budget?.initialTotal || journey?.budget?.total);
       const baseBudget = userEnteredBudget ? (journey.budget.initialTotal || journey.budget.total) : 0;
       
       if (userEnteredBudget) {
          const proposedTotal = updated.reduce((sum, city) => sum + (city.subCheckpoints || []).reduce((cSum, cp) => cSum + (Number(cp.cost) || 0), 0), 0);
          if (proposedTotal > baseBudget) {
             setGlobalBudgetError(cpId);
             setTimeout(() => setGlobalBudgetError(""), 3000);
             return false;
          } else {
             setGlobalBudgetError("");
          }
       }
    }

    setItems(updated);
    if (saveToDb) handleUpdateDestinationDB(updated);
    return true;
  };

  const handleAddSuggestedCheckpoint = async (cityId, poi) => {
    const newCheckpoint = {
      id: `cp-${Date.now()}-${Math.random()}`,
      name: poi.name,
      lat: poi.lat,
      lng: poi.lng,
      visited: false,
      category: poi.category,
      transport: "Walk",
      cost: 0
    };

    const updatedCheckpoints = items.map(city => {
      if (city.id === cityId) {
        return { ...city, subCheckpoints: [...(city.subCheckpoints || []), newCheckpoint] };
      }
      return city;
    });

    setItems(updatedCheckpoints);
    try {
      await updateJourney(journey.id, { checkpoints: updatedCheckpoints });
      setJourney({ ...journey, checkpoints: updatedCheckpoints });
    } catch(err) {
      console.error("Failed to add checkpoint to database", err);
    }
  };

  const handleCompleteTrip = async () => {
    const newStatus = journey.status === 'completed' ? 'planned' : 'completed';
    try {
      const res = await updateJourney(journey.id, { status: newStatus });
      setJourney(res.journey);
    } catch(err) {
      console.error(err);
    }
  };

  const handleDeleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteJourney(journey.id);
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to delete trip:", err);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 min-h-screen flex items-center justify-center">Loading timeline...</div>;
  if (!journey) return <div className="p-8 text-center text-red-500 min-h-screen flex items-center justify-center">Trip not found.</div>;

  const userEnteredBudget = Boolean(journey?.budget?.initialTotal || journey?.budget?.total);
  const baseBudget = userEnteredBudget ? (journey.budget.initialTotal || journey.budget.total) : (calculateTotalSpent() || 0);
  
  const calculateDynamicCost = () => {
     let accommodation = 0;
     let food = 0;
     let activities = 0;
     let transport = 0;

     items.forEach(city => {
        transport += (Number(city.cost) || 0);
        
        (city.subCheckpoints || []).forEach(cp => {
           let cpCost = Number(cp.cost) || 0;
           
           const nameLower = cp.name ? cp.name.toLowerCase() : "";
           if (cp.category === 'stay' || nameLower.includes('hotel') || nameLower.includes('stay') || nameLower.includes('resort') || nameLower.includes('hostel') || nameLower.includes('airbnb')) {
              accommodation += cpCost;
           } else if (cp.category === 'eat' || nameLower.includes('restaurant') || nameLower.includes('cafe') || nameLower.includes('food') || nameLower.includes('dine') || nameLower.includes('lunch') || nameLower.includes('dinner')) {
              food += cpCost;
           } else {
              activities += cpCost;
           }
        });
     });

     return { accommodation, food, activities, transport };
  };

  const dynamicChunks = calculateDynamicCost();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex flex-col overflow-hidden">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
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
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{journey.title}</h1>
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
              <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
              <span className="material-icons-outlined text-sm">group</span>
              {journey.travelers || 1} Traveler(s)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <button 
              onClick={handleCompleteTrip}
              className={`inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all transform hover:-translate-y-0.5 ${journey.status === 'completed' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600' : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/30'}`}
             >
                <span className="material-icons-outlined text-lg">{journey.status === 'completed' ? 'undo' : 'done_all'}</span>
                {journey.status === 'completed' ? 'Mark Planned' : 'Mark Complete'}
             </button>
             <Link to={`/plan?edit=${journey.id}`} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-all transform hover:-translate-y-0.5">
               <span className="material-icons-outlined text-lg">edit</span>
               Edit Trip
             </Link>
            <button onClick={handleDeleteTrip} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg text-sm font-bold shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition-all transform hover:-translate-y-0.5">
               <span className="material-icons-outlined text-lg">delete</span>
               Delete
             </button>
            <button onClick={() => setShowReportModal(true)} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all transform hover:-translate-y-0.5">
              <span className="material-icons-outlined text-lg">receipt_long</span>
              Generate Report
            </button>
            <Link to={`/analytics?id=${journey.id}`} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform hover:-translate-y-0.5">
              <span className="material-icons-outlined text-lg">analytics</span>
              Map & Analytics
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 bg-surface-light dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl relative z-10 flex flex-col p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">map</span>
                  Destinations & Checkpoints
                </h2>
                <p className="text-sm text-slate-500 mt-1">Review your itinerary block by block with live location suggestions.</p>
              </div>
            </div>
            
            <div className="relative pt-4">
              <div className="absolute left-[26px] top-4 bottom-4 w-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>

              <div className="pl-[56px]">
                {items.length === 0 ? (
                   <p className="text-slate-500 text-center py-10">No destinations plotted for this journey.</p>
                ) : (
                  items.map((cityObj, index) => (
                    <DestinationAccordion 
                      key={cityObj.id} 
                      city={cityObj} 
                      index={index}
                      baseBudget={baseBudget}
                      previousCity={index > 0 ? items[index - 1].name : null}
                      currencySym={currencySym}
                      onToggleVisited={handleToggleVisited} 
                      onUpdateDestination={handleUpdateDestination}
                      onUpdateCheckpoint={handleUpdateCheckpoint}
                      errorFieldId={globalBudgetError}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">

            <div className="bg-gradient-to-br from-primary to-cyan-500 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-[20px] pointer-events-none"></div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2 relative z-10">
                <span className="material-icons-round">account_balance_wallet</span>
                Wallet Overview
              </h3>
              <p className="text-primary-100 text-sm mb-4 relative z-10">{userEnteredBudget ? "Trip Budget Estimate" : "Estimated Cost"}</p>
              <p className="text-4xl font-black mb-1 relative z-10">{currencySym}{userEnteredBudget ? baseBudget.toLocaleString() : calculateTotalSpent().toLocaleString()}</p>
              {userEnteredBudget && (
                <p className="text-xs text-white/80 font-medium mb-6 relative z-10 transition-all">
                  Spent Till Now: <span className={calculateTotalSpent() > baseBudget ? "text-red-200 font-bold" : "font-bold"}>{currencySym}{calculateTotalSpent().toLocaleString()}</span>
                </p>
              )}
              {!userEnteredBudget && <div className="mb-6"></div>}

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">Hotel/Stay</span>
                  <span className="font-bold">{currencySym}{dynamicChunks.accommodation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">Dining</span>
                  <span className="font-bold">{currencySym}{dynamicChunks.food.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">Experiences</span>
                  <span className="font-bold">{currencySym}{dynamicChunks.activities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-2 px-6 pt-6 pb-2 text-slate-900 dark:text-white">
                <span className="material-icons-round text-primary">luggage</span>
                Packing List
              </h3>
              <div className="w-full flex-1">
                <iframe 
                  src="/travel-tools.html" 
                  title="Packing List Tool"
                  className="w-full border-0"
                  style={{ minHeight: '480px' }}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Generated Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 overflow-hidden flex flex-col rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
                  <span className="material-icons text-xl">assessment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trip Report Summary</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 relative">
              {/* Visualized Content */}
              <div className="max-w-3xl mx-auto p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem]" ref={reportRef}>
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{journey.title}</h1>
                  <p className="text-lg text-slate-500 font-medium">Detailed Itinerary & Cost Analysis</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <div className="bg-blue-50 dark:bg-slate-800/60 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-700">
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Status</span>
                    <span className={`inline-block px-2 text-sm font-bold rounded-md ${journey.status === 'completed' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'}`}>{journey.status.toUpperCase()}</span>
                  </div>
                  <div className="bg-indigo-50 dark:bg-slate-800/60 p-4 rounded-xl text-center border border-indigo-100 dark:border-slate-700">
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Destinations</span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200">{items.length} Places</span>
                  </div>
                  {userEnteredBudget && (
                    <div className="bg-green-50 dark:bg-slate-800/60 p-4 rounded-xl text-center border border-green-100 dark:border-slate-700">
                      <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Total Budget</span>
                      <span className="text-lg font-black text-slate-800 dark:text-slate-200">{currencySym}{journey.budget?.initialTotal || journey.budget?.total || "TBA"}</span>
                    </div>
                  )}
                  <div className={`p-4 rounded-xl text-center border ${userEnteredBudget && calculateTotalSpent() > (journey.budget?.initialTotal || journey.budget?.total || 0) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50'} ${!userEnteredBudget ? 'col-span-2 md:col-span-2' : ''}`}>
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Total Estimated</span>
                    <span className={`text-lg font-black ${userEnteredBudget && calculateTotalSpent() > (journey.budget?.initialTotal || journey.budget?.total || 0) ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{currencySym}{calculateTotalSpent()}</span>
                  </div>
                </div>

                <div className="relative pt-2 pl-4 md:pl-8">
                  {items.length > 1 && (
                    <div className="absolute left-[20px] md:left-[36px] top-10 bottom-10 w-[3px] bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
                  )}
                  <div className="space-y-8 relative z-10">
                    {items.map((city, idx) => (
                      <div key={city.id} className="relative mt-8">
                         {/* Optional pill showing transit between destinations in the report */}
                         {idx > 0 && (
                            <div className="absolute top-[-20px] left-[-26px] z-20 flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full border-2 border-primary bg-white dark:bg-slate-900"></div>
                               <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-full px-3 py-0.5 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                  <span className="material-icons-outlined text-[14px] text-primary">directions_transit</span>
                                  {city.transport || 'N/A'}
                                  <span className="text-slate-300 dark:text-slate-600">|</span>
                                  <span className="text-green-600">{currencySym}{city.cost || 0}</span>
                               </div>
                            </div>
                         )}

                         <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/80"></div>
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-4">
                             <div className="flex items-center gap-3">
                               <div className="bg-slate-100 dark:bg-slate-800 h-10 w-10 flex items-center justify-center rounded-full font-black text-slate-400">
                                 {idx + 1}
                               </div>
                               <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{city.name}</h2>
                             </div>
                           </div>
                           
                           <div className="pl-14">
                             <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Planned Checkpoints</h4>
                             {city.subCheckpoints && city.subCheckpoints.length > 0 ? (
                                <div className="relative">
                                  <div className="absolute left-[13px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-slate-200 dark:border-slate-700 z-0"></div>
                                  <ul className="space-y-4 relative z-10">
                                    {city.subCheckpoints.map((cp, cIdx) => (
                                      <li key={cp.id} className="relative mt-4">
                                         <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                           <div className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                                             <div className="w-7 h-7 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm z-10 relative">
                                                <span className="material-icons text-primary/70 text-[16px]">push_pin</span>
                                             </div>
                                             {cp.name}
                                           </div>
                                           <div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
                                             <span>{cp.transport || "N/A"}</span>
                                             <span className="font-bold text-slate-700 dark:text-slate-300">{currencySym}{cp.cost || 0}</span>
                                           </div>
                                         </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                             ) : (
                                <p className="text-sm text-slate-400 italic">No specific checkpoints recorded for this destination.</p>
                             )}
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium px-2 hidden sm:block">Generated by RouteCraft System</span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button onClick={downloadReport} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-4 md:px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700">
                  <span className="material-icons-outlined">description</span>
                  <span className="hidden md:inline">Download</span> .txt
                </button>
                <button onClick={downloadReportImage} disabled={downloadingImg} className={`flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-4 md:px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md ${downloadingImg ? 'opacity-70 cursor-wait' : ''}`}>
                  {downloadingImg ? (
                    <span className="material-icons-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-icons-outlined">image</span>
                  )}
                  <span className="hidden md:inline">Download</span> Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
