import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createJourney, getJourneys, updateJourney } from "../services/api";
import LocationAutocomplete from "../components/LocationAutocomplete";
import CheckpointSuggestions from "../components/CheckpointSuggestions";
import { useAuth } from "../context/AuthContext";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCheckpoint({ 
  cp, destId, destCity, currencySym, updateCheckpointField, removeCheckpoint 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: cp.id, 
    data: { type: 'Checkpoint', destId } 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative animate-fade-in-up bg-white dark:bg-slate-800/80 p-3 pr-2 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-2 group/cp mt-12 min-w-0"
    >
      {/* Checkpoint Transport Pill Layer */}
      <div className="absolute top-[-44px] z-20 flex items-center gap-2" style={{ left: '-21px' }}>
         <div className="w-2 h-2 rounded-full border border-slate-400 bg-white dark:bg-slate-800"></div>

         <div className="flex flex-row bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full py-1 px-3 items-center gap-2">
            <select 
              value={cp.transport} 
              onChange={(e) => updateCheckpointField(destId, cp.id, 'transport', e.target.value)}
              className="text-[10px] font-semibold bg-transparent outline-none focus:text-primary cursor-pointer text-slate-500"
            >
              <option value="Walk">🚶 Walk</option>
              <option value="Cab">🚕 Cab/Taxi</option>
              <option value="Transit">🚇 Transit</option>
            </select>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center">
              <span className="text-[10px] text-slate-400 font-bold mr-1">{currencySym}</span>
              <input 
                type="number" 
                placeholder="0"
                min="0"
                value={cp.cost}
                onChange={(e) => updateCheckpointField(destId, cp.id, 'cost', e.target.value)}
                className="w-14 text-[10px] font-mono bg-transparent outline-none text-slate-600 dark:text-slate-400"
              />
            </div>
         </div>
      </div>

      <div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 z-10 transition-colors group-hover/cp:border-primary"
        style={{ left: '-23px' }}
      ></div>

      <div 
        {...attributes} 
        {...listeners} 
        className="mt-1 flex-shrink-0 cursor-grab text-slate-300 hover:text-primary transition-colors focus:outline-none"
        title="Drag to reorder"
      >
        <span className="material-icons-outlined text-xl">drag_indicator</span>
      </div>

      <div className="flex-1 min-w-0 relative">
        <LocationAutocomplete
          value={cp.name}
          onChange={(val) => updateCheckpointField(destId, cp.id, 'name', val)}
          placeholder="e.g. The Louvre Museum"
          type="checkpoint"
          context={destCity}
          className="text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary/50 focus:border-primary/50 w-full"
        />
      </div>

      <button type="button" onClick={() => removeCheckpoint(destId, cp.id)} className="flex-shrink-0 text-slate-400 hover:text-red-500 p-1 rounded-full z-10 opacity-0 group-hover/cp:opacity-100 transition-opacity self-center mr-1">
        <span className="material-icons-outlined text-lg">close</span>
      </button>
    </div>
  );
}

function SortableDestination({
  dest, dIndex, destinationsLength, previousCity,
  currencySym, updateDestinationField, removeDestination, 
  addCheckpoint, removeCheckpoint, updateCheckpointField, addSpecificCheckpoint
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: dest.id, 
    data: { type: 'Destination' } 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-full mt-12 mb-2">
      
      {/* Transport Pill on the main string */}
      <div className="absolute top-[-38px] z-30 flex items-center gap-3" style={{ left: '-36px' }}>
         <div className="w-3 h-3 rounded-full border-2 border-primary bg-white dark:bg-slate-900"></div>

         <div className="flex flex-row bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/80 shadow-md rounded-full py-1 px-4 items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 max-w-[100px] truncate" title={previousCity ? `Travel from ${previousCity}` : "Travel from Home"}>
               {previousCity ? `From ${previousCity}` : "From Home"}
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <select 
              value={dest.transport} 
              onChange={(e) => updateDestinationField(dest.id, 'transport', e.target.value)}
              className="text-xs font-bold bg-transparent outline-none focus:text-primary cursor-pointer text-slate-700 dark:text-slate-200"
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
                min="0"
                placeholder="0"
                value={dest.cost}
                onChange={(e) => updateDestinationField(dest.id, 'cost', e.target.value)}
                className="w-16 text-xs font-mono font-bold bg-transparent outline-none text-slate-700 dark:text-slate-300"
              />
            </div>
         </div>
      </div>

      <div className="relative group bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 transition-all hover:border-primary/30">
        
        {/* Destination Node on timeline */}
        <div 
          className="absolute top-6 w-5 h-5 rounded-full border-4 border-primary bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm z-10"
          style={{ left: '-42px' }}
        >
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
        </div>

        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-6 p-1 cursor-grab text-slate-300 hover:text-primary bg-white dark:bg-slate-900 rounded-full shadow-sm z-20 transition-all opacity-0 group-hover:opacity-100"
          style={{ left: '-20px' }}
          title="Drag to reorder destination"
        >
          <span className="material-icons-outlined text-sm">drag_indicator</span>
        </div>

        {destinationsLength > 1 && (
          <button type="button" onClick={() => removeDestination(dest.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Destination {dIndex + 1}
          </label>
          <LocationAutocomplete
            value={dest.city}
            onChange={(val) => updateDestinationField(dest.id, 'city', val)}
            placeholder="e.g. Paris, France"
            icon={dIndex === 0 ? 'trip_origin' : 'location_city'}
            type="city"
            className="font-bold text-lg"
          />
        </div>

        {dest.city.trim().length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center justify-between mb-4">
               <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                 Routing details & specific checkpoints
               </label>
             </div>
             
             <div className="relative mt-2 mb-3 pl-[32px]">
                {dest.checkpoints.length > 0 && (
                  <div className="absolute left-[15px] top-6 bottom-[0px] w-[2px] border-l-2 border-dashed border-slate-300 dark:border-slate-600 z-0"></div>
                )}

                <div className="relative z-10">
                  <SortableContext items={dest.checkpoints.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {dest.checkpoints.map((cp) => (
                      <div key={cp.id}>
                        <SortableCheckpoint 
                          cp={cp} 
                          destId={dest.id} 
                          destCity={dest.city}
                          currencySym={currencySym} 
                          updateCheckpointField={updateCheckpointField} 
                          removeCheckpoint={removeCheckpoint}
                        />
                        {cp.name && cp.name.trim().length > 2 && (
                           <div className="ml-10 mt-3">
                              <CheckpointSuggestions 
                                checkpointName={cp.name} 
                                cityName={dest.city} 
                                onAddSuggestion={(name) => addSpecificCheckpoint(dest.id, name)} 
                              />
                           </div>
                        )}
                      </div>
                    ))}
                  </SortableContext>
                </div>
             </div>
             
             <div className="ml-[32px] mt-8 flex items-center gap-3 opacity-70 hover:opacity-100 cursor-pointer group" onClick={() => addCheckpoint(dest.id)}>
               <div className="flex-shrink-0 w-8 h-8 rounded-full border border-dashed border-slate-400 text-slate-400 flex items-center justify-center group-hover:bg-slate-50 group-hover:border-primary group-hover:text-primary transition-all">
                 <span className="material-icons-outlined text-sm">add</span>
               </div>
               <div className="text-sm font-medium text-slate-500 group-hover:text-primary transition-all">
                 Add Check-point
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateJourney() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const currencyCode = user?.profile?.preferences?.currency || "USD";
  const currencySym = (() => {
    switch (currencyCode) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR': return '₹';
      case 'USD': default: return '$';
    }
  })();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [destinations, setDestinations] = useState([
    { id: `dest-${Date.now()}`, city: "", transport: "Flight", cost: "", checkpoints: [] }
  ]);
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showEmptyFieldModal, setShowEmptyFieldModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);
  
  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(!!editId);
  const [notes, setNotes] = useState("");
  const [startDateVal, setStartDateVal] = useState(null);
  const [endDateVal, setEndDateVal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Destination' && overType === 'Destination') {
      setDestinations((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    if (activeType === 'Checkpoint' && overType === 'Checkpoint') {
      const activeDestId = active.data.current?.destId;
      const overDestId = over.data.current?.destId;
      
      if (activeDestId === overDestId) {
        setDestinations((items) => {
          return items.map(dest => {
            if (dest.id === activeDestId) {
              const oldIndex = dest.checkpoints.findIndex((i) => i.id === active.id);
              const newIndex = dest.checkpoints.findIndex((i) => i.id === over.id);
              return { ...dest, checkpoints: arrayMove(dest.checkpoints, oldIndex, newIndex) };
            }
            return dest;
          });
        });
      }
    }
  };

  useEffect(() => {
    if (editId) {
      getJourneys().then(res => {
        const found = res.journeys?.find(j => j.id === editId);
        if (found) {
           setInitialData(found);
           setNotes(found.notes || "");
           if (found.startDate) setStartDateVal(new Date(found.startDate));
           if (found.endDate) setEndDateVal(new Date(found.endDate));
           
           if (found.checkpoints && found.checkpoints.length > 0) {
             if (found.checkpoints[0].type === "city") {
               setDestinations(found.checkpoints.map(cp => ({
                 id: cp.id || `dest-${Math.random()}`,
                 city: cp.name,
                 transport: cp.transport || "Flight",
                 cost: cp.cost || "",
                 checkpoints: cp.subCheckpoints ? cp.subCheckpoints.map(scp => ({
                   id: scp.id || `cp-${Math.random()}`,
                   name: scp.name,
                   transport: scp.transport || "Walk",
                   cost: scp.cost || ""
                 })) : []
               })));
             } else {
               const flatNames = found.checkpoints;
               if (flatNames.length === 1) {
                 setDestinations([{ id: `dest-1`, city: flatNames[0].name, transport: flatNames[0].transport || "Flight", cost: flatNames[0].cost || "", checkpoints: [] }]);
               } else if (flatNames.length > 1) {
                 setDestinations(flatNames.map((cp, i) => ({
                   id: `dest-${i}`,
                   city: cp.name,
                   transport: cp.transport || "Flight",
                   cost: cp.cost || "",
                   checkpoints: []
                 })));
               }
             }
           } else {
             setDestinations([{ id: `dest-${Date.now()}`, city: "", transport: "Flight", cost: "", checkpoints: [] }]);
           }
        }
      }).catch(err => {
        console.error("Failed to load journey for edit", err);
      }).finally(() => {
        setLoadingInitial(false);
      });
    }
  }, [editId]);

  const commitSubmission = async (pPayload) => {
    try {
      if (editId) {
        await updateJourney(editId, Object.assign({}, initialData, pPayload));
        navigate("/timeline?id=" + editId);
      } else {
        const res = await createJourney(pPayload);
        navigate("/timeline?id=" + res?.journey?.id);
      }
    } catch (err) {
      setError(err?.message || `Failed to ${editId ? 'update' : 'create'} journey`);
    } finally {
      setSubmitting(false);
      setShowBudgetModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    processFormSubmission(new FormData(e.target));
  };
  
  const processFormSubmission = async (formData, overrideEmptyCheck = false) => {
    setError(null);
    setSubmitting(true);
    
    const formatDt = (dt) => dt ? new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : "";
    const startDate = formatDt(startDateVal);
    const endDate = formatDt(endDateVal);
    
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setSubmitting(false);
      setError("End date cannot be logically before the Start date.");
      return;
    }
    const budgetRaw = formData.get("budget");
    const budget = Number(budgetRaw);
    const travelers = Number(formData.get("travelers")) || 1;

    let hasCities = false;
    destinations.forEach(d => { if (d.city.trim()) hasCities = true; });
    
    if (!hasCities) {
      setSubmitting(false);
      setError("Please add at least one valid destination city or country.");
      return;
    }

    if (!overrideEmptyCheck) {
      let isAnyFieldEmpty = false;
      if (!startDate || !endDate || !budgetRaw || !notes.trim()) {
        isAnyFieldEmpty = true;
      }
      destinations.forEach(d => {
         if (!d.city.trim() || d.cost === "") isAnyFieldEmpty = true;
         d.checkpoints.forEach(cp => {
            if (!cp.name.trim() || cp.cost === "") isAnyFieldEmpty = true;
         });
      });

      if (isAnyFieldEmpty) {
        setPendingFormData(formData);
        setShowEmptyFieldModal(true);
        setSubmitting(false);
        return;
      }
    }

    const calculatedTotalSpent = destinations.reduce((sum, d) => {
       const destCost = Number(d.cost) || 0;
       const cpCost = d.checkpoints.reduce((cSum, cp) => cSum + (Number(cp.cost) || 0), 0);
       return sum + destCost + cpCost;
    }, 0);
    
    const geocodePoint = async (placeName) => {
       try {
         const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`);
         const data = await res.json();
         if (data && data.length > 0) {
            return { name: placeName, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
         }
       } catch (err) {
         console.warn("Geocoding issue", err);
       }
       return { name: placeName, lat: null, lng: null };
    };

    const processedCheckpoints = await Promise.all(destinations.map(async (dest) => {
        if (!dest.city.trim()) return null;
        const main = await geocodePoint(dest.city.trim());
        
        const cps = await Promise.all(dest.checkpoints.map(async (cpObj) => {
            if (!cpObj.name.trim()) return null;
            const geo = await geocodePoint(`${cpObj.name.trim()}, ${dest.city.trim()}`);
            return { ...geo, name: cpObj.name.trim(), transport: cpObj.transport, cost: Number(cpObj.cost) || 0, id: `cp-${Date.now()}-${Math.random()}`, visited: false };
        }));
        
        return {
           id: `city-${Date.now()}-${Math.random()}`,
           type: "city",
           name: dest.city.trim(),
           transport: dest.transport,
           cost: Number(dest.cost) || 0,
           lat: main.lat,
           lng: main.lng,
           subCheckpoints: cps.filter(Boolean)
        };
    }));

    const finalCheckpoints = processedCheckpoints.filter(Boolean);
    
    let title = "New Journey";
    if (finalCheckpoints.length === 1) {
      title = `Trip to ${finalCheckpoints[0].name}`;
    } else if (finalCheckpoints.length > 1) {
      title = `${finalCheckpoints[0].name} → ${finalCheckpoints[finalCheckpoints.length - 1].name}`;
    }

    const payload = {
      title: title,
      dateRange: startDate || endDate ? `${startDate || ""} to ${endDate || ""}`.trim() : "",
      startDate,
      endDate,
      travelers,
      checkpoints: finalCheckpoints,
      budget: budget ? { total: Math.max(budget, calculatedTotalSpent), initialTotal: budget, currency: currencyCode } : {},
      status: "planned",
      notes: notes,
      transport: [],
    };

    if (budget > 0 && calculatedTotalSpent > budget) {
       setSubmitting(false);
       setError(`Total estimated cost (${currencySym}${calculatedTotalSpent}) exceeds your allocated trip budget of ${currencySym}${budget}. Please adjust your destination costs to proceed.`);
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    await commitSubmission(payload);
  };

  const addDestination = () => {
    setDestinations([...destinations, { id: `dest-${Date.now()}`, city: "", transport: "Flight", cost: "", checkpoints: [] }]);
  };

  const updateDestinationField = (id, field, val) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, [field]: val } : d));
  };

  const updateDestinationCity = (id, newCity) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, city: newCity } : d));
  };

  const removeDestination = (id) => {
    if (destinations.length > 1) setDestinations(destinations.filter(d => d.id !== id));
  };

  const addCheckpoint = (destId) => {
    setDestinations(destinations.map(d => 
      d.id === destId ? { ...d, checkpoints: [...d.checkpoints, { id: `cp-${Date.now()}`, name: "", transport: "Walk", cost: "" }] } : d
    ));
  };

  const addSpecificCheckpoint = (destId, checkpointName) => {
    setDestinations(destinations.map(d => {
      if (d.id === destId) {
        if (d.checkpoints.find(c => c.name === checkpointName)) return d;
        if (d.checkpoints.length > 0 && d.checkpoints[d.checkpoints.length - 1].name === "") {
           const newCps = [...d.checkpoints];
           newCps[newCps.length - 1].name = checkpointName;
           return { ...d, checkpoints: newCps };
        }
        return { ...d, checkpoints: [...d.checkpoints, { id: `cp-${Date.now()}`, name: checkpointName, transport: "Walk", cost: "" }] };
      }
      return d;
    }));
  };

  const updateCheckpointField = (destId, cpId, field, newValue) => {
    setDestinations(destinations.map(d => {
      if (d.id === destId) {
        const newCps = d.checkpoints.map(cp => cp.id === cpId ? { ...cp, [field]: newValue } : cp);
        return { ...d, checkpoints: newCps };
      }
      return d;
    }));
  };

  const removeCheckpoint = (destId, cpId) => {
    setDestinations(destinations.map(d => {
      if (d.id === destId) {
        return { ...d, checkpoints: d.checkpoints.filter(cp => cp.id !== cpId) };
      }
      return d;
    }));
  };

  const appendNotes = (newNote) => {
    setNotes(prev => prev ? prev + newNote : newNote.trim());
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-6xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-icons-outlined text-base">arrow_back</span>
              Dashboard
            </Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {editId ? "Edit Journey" : "New Journey"}
            </span>
          </div>

          <div className="bg-white dark:bg-[#15232b] rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {editId ? "Edit Your Adventure" : "Plan Your Adventure"}
               </h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                 {editId ? "Modify the details of your trip below." : "Add destinations and multiple specific checkpoints. We fetch live suggestions for your itinerary!"}
               </p>
            </div>

            {loadingInitial ? (
              <div className="p-8 text-center text-slate-500">Loading trip details...</div>
            ) : (
            <form className="p-8 pb-10" onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                <div className="flex-1 space-y-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Destinations & Checkpoints</h2>
                
                {error && <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <div className="relative pl-[48px] pt-4 pb-4">
                    {/* Visual Thread connection line for destinations */}
                    {destinations.length > 0 && (
                      <div className="absolute left-[18px] top-4 bottom-10 w-[2px] border-l-2 border-dashed border-primary/30 dark:border-primary/20 z-0 hidden md:block"></div>
                    )}
                    
                    <SortableContext items={destinations.map(d => d.id)} strategy={verticalListSortingStrategy}>
                      {destinations.map((dest, dIndex) => (
                        <SortableDestination 
                          key={dest.id}
                          dest={dest}
                          dIndex={dIndex}
                          destinationsLength={destinations.length}
                          previousCity={dIndex > 0 ? destinations[dIndex - 1].city : null}
                          currencySym={currencySym}
                          updateDestinationField={updateDestinationField}
                          removeDestination={removeDestination}
                          addCheckpoint={addCheckpoint}
                          removeCheckpoint={removeCheckpoint}
                          updateCheckpointField={updateCheckpointField}
                          addSpecificCheckpoint={addSpecificCheckpoint}
                        />
                      ))}
                    </SortableContext>
                    
                    <button type="button" onClick={addDestination} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all text-sm font-bold mt-8 relative z-10">
                      <span className="material-icons-outlined">add_location_alt</span>
                      Add Another Destination
                    </button>
                  </div>
                </DndContext>
                </div>

                <div className="hidden lg:block w-px bg-slate-100 dark:bg-slate-800/60 shrink-0"></div>
                <div className="lg:hidden h-px bg-slate-100 dark:bg-slate-800/60 my-2"></div>

                <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col">
                  <div className="space-y-6 flex-grow">
                     <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Logistics & Budget</h2>
                     
                     <div className="space-y-5">
                       <div className="grid grid-cols-2 gap-4 z-40">
                         <div>
                           <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                           <div className="relative">
                             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 z-10">
                                <span className="material-icons-outlined text-sm">calendar_today</span>
                             </div>
                             <DatePicker 
                               selected={startDateVal} 
                               onChange={(date) => {
                                  setStartDateVal(date);
                                  if (endDateVal && date > endDateVal) setEndDateVal(null);
                               }}
                               selectsStart
                               startDate={startDateVal}
                               endDate={endDateVal}
                               dateFormat="dd MMM yyyy"
                               placeholderText="Select start date"
                               className="block w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 sm:text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow transition-colors" 
                             />
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                           <div className="relative">
                             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 z-10">
                                <span className="material-icons-outlined text-sm">event</span>
                             </div>
                             <DatePicker 
                               selected={endDateVal} 
                               onChange={(date) => setEndDateVal(date)}
                               selectsEnd
                               startDate={startDateVal}
                               endDate={endDateVal}
                               minDate={startDateVal}
                               dateFormat="dd MMM yyyy"
                               placeholderText="Select end date"
                               className="block w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 sm:text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow transition-colors" 
                             />
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Travelers</label>
                           <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <span className="material-icons-outlined text-sm">group</span>
                             </div>
                             <input className="block w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 sm:text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" type="number" min="1" name="travelers" defaultValue={initialData?.travelers || 1} />
                           </div>
                         </div>

                         <div>
                           <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Budget ({currencyCode})</label>
                           <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">{currencySym}</div>
                             <input className="block w-full pl-8 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono sm:text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" id="budget" name="budget" defaultValue={initialData?.budget?.total || ""} placeholder="2500" type="number" min="0" />
                           </div>
                         </div>
                       </div>
                       
                       <div>
                         <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="notes">Travel Notes & Suggestions</label>
                         <textarea name="notes" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 sm:text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" rows="5" placeholder="Tap on checkpoint suggestions to auto-add them here..."></textarea>
                       </div>
                     </div>
                  </div>

                  <div className="pt-6 mt-auto">
                    <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-primary/30 transition-all outline-none focus:ring-4 focus:ring-primary/20">
                      <span className="material-icons-outlined">{editId ? "save" : "map"}</span>
                      {submitting ? (editId ? "Saving..." : "Creating...") : (editId ? "Save Changes" : "Generate Journey")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>

      {/* Budget Limit Exceeded Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 animate-slide-up">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center rounded-full mb-4 mx-auto">
              <span className="material-icons">account_balance_wallet</span>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Budget Exceeded</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 leading-relaxed">
              Based on your planning, this trip costs <strong className="text-slate-700 dark:text-slate-200">{currencySym}{pendingPayload?.budget?.total}</strong>, which is over your initial allocated budget! Please adjust the costs to be within your budget.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowBudgetModal(false); setSubmitting(false); }} 
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Go Back and Adjust
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Fields Modal */}
      {showEmptyFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 animate-slide-up">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center rounded-full mb-4 mx-auto">
              <span className="material-icons">warning_amber</span>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Empty Fields Detected</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 leading-relaxed">
              Some fields have been left empty (e.g., costs, dates, or notes). Are you sure you want to proceed without providing all details?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowEmptyFieldModal(false); processFormSubmission(pendingFormData, true); }} 
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Yes, Proceed Anyway
              </button>
              <button 
                onClick={() => { setShowEmptyFieldModal(false); setSubmitting(false); setPendingFormData(null); }} 
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                No, Go Back and Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
