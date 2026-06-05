"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Settings, 
  Shield, 
  Flame, 
  Activity, 
  ChevronDown, 
  ChevronLeft,
  Navigation,
  Check,
  AlertTriangle,
  Globe,
  Loader2,
  RefreshCw,
  Wind
} from "lucide-react";
import { toast } from "react-toastify";

interface SendingUnitsProps {
  onBackToDashboard: () => void;
}

interface DisasterMarker {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  type: "nasa" | "local" | "dispatched";
  color: string;
}

export default function SendingUnits({ onBackToDashboard }: SendingUnitsProps) {
  // Navigation & Control States
  const [selectedUnit, setSelectedUnit] = useState<"Police" | "Fire" | "Rescue">("Police");
  const [incidentType, setIncidentType] = useState<string>("Flooding");
  const [problemDescription, setProblemDescription] = useState<string>("Severe flooding and landslide alert in central region");
  const [victimCount, setVictimCount] = useState<string>("1-4");
  const [aggressorCount, setAggressorCount] = useState<string>("No one");
  const [dangerLevel, setDangerLevel] = useState<number>(65); // Default rating
  
  // NASA EONET API States
  const [nasaEvents, setNasaEvents] = useState<any[]>([]);
  const [isLoadingNasa, setIsLoadingNasa] = useState(true);
  const [errorNasa, setErrorNasa] = useState<string | null>(null);
  
  // Map Markers State
  const [markers, setMarkers] = useState<DisasterMarker[]>([
    // Local / Vietnam Predefined disaster monitoring points
    { 
      id: "local-1", 
      title: "Lũ quét & Sạt lở đất (Hà Giang)", 
      category: "Landslide", 
      lat: 22.3, 
      lng: 103.9, 
      type: "local", 
      color: "#f59e0b" 
    },
    { 
      id: "local-2", 
      title: "Cảnh báo Lũ lụt miền Trung (Đà Nẵng)", 
      category: "Flooding", 
      lat: 16.0471, 
      lng: 108.2068, 
      type: "local", 
      color: "#ef4444" 
    },
    { 
      id: "local-3", 
      title: "Giám sát Triều cường & Sạt lở (TP.HCM)", 
      category: "Water Spout", 
      lat: 10.7769, 
      lng: 106.7009, 
      type: "local", 
      color: "#3b82f6" 
    }
  ]);

  // Leaflet Map instance state
  const [map, setMap] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load Leaflet resources dynamically from CDN
  useEffect(() => {
    // Load Leaflet CSS
    let cssLink = document.getElementById("leaflet-css") as HTMLLinkElement;
    if (!cssLink) {
      cssLink = document.createElement("link");
      cssLink.id = "leaflet-css";
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(cssLink);
    }

    // Load Leaflet JS
    let jsScript = document.getElementById("leaflet-js") as HTMLScriptElement;
    
    const initLeafletMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      // Clean up previous map instance if any
      const existingContainer = L.DomUtil.get("leaflet-map");
      if (existingContainer) {
        (existingContainer as any)._leaflet_id = null;
      }

      // Initialize map centered at Vietnam coordinates
      const mapInstance = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([16.0, 107.5], 6);

      // Add Zoom Control to bottom right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance);

      // Add ESRI Satellite Imagery layer
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri"
      }).addTo(mapInstance);

      // Add ESRI Places and Boundaries labels layer
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19
      }).addTo(mapInstance);

      // Handle map click to get coordinate for dispatch
      mapInstance.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        setProblemDescription(prev => {
          if (prev.includes("Coordinates:")) {
            return prev.split("Coordinates:")[0].trim() + `\nCoordinates: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
          }
          return prev + `\nCoordinates: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`;
        });
        toast.info(`Selected dispatch point at Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, {
          toastId: "dispatch-point-click"
        });
      });

      setMap(mapInstance);
      setMapLoaded(true);
    };

    if (!jsScript) {
      jsScript = document.createElement("script");
      jsScript.id = "leaflet-js";
      jsScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.head.appendChild(jsScript);
      jsScript.onload = () => {
        initLeafletMap();
      };
    } else {
      if ((window as any).L) {
        initLeafletMap();
      } else {
        jsScript.onload = () => {
          initLeafletMap();
        };
      }
    }

    return () => {
      // Clean up map on component unmount
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Fetch Live Natural Disasters from NASA EONET API
  const fetchNasaEvents = () => {
    setIsLoadingNasa(true);
    setErrorNasa(null);
    fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=30")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch EONET events");
        return res.json();
      })
      .then((data) => {
        if (data && data.events) {
          const events = data.events.map((e: any) => {
            const geom = e.geometry && e.geometry[0];
            const coords = geom && geom.coordinates; // [lng, lat]
            const lng = coords ? coords[0] : null;
            const lat = coords ? coords[1] : null;
            return {
              id: e.id,
              title: e.title,
              category: e.categories && e.categories[0] ? e.categories[0].title : "Disaster",
              lat,
              lng,
              date: geom ? geom.date : new Date().toISOString()
            };
          });

          setNasaEvents(events);

          const newMarkers = [...markers.filter(m => m.type !== "nasa")];
          
          events.forEach((event: any) => {
            if (event.lat !== null && event.lng !== null) {
              newMarkers.push({
                id: event.id,
                title: `NASA Alert: ${event.title}`,
                category: event.category,
                lat: event.lat,
                lng: event.lng,
                type: "nasa",
                color: "#10b981" // Active Green for NASA events
              });
            }
          });

          setMarkers(newMarkers);
        }
        setIsLoadingNasa(false);
      })
      .catch((err) => {
        console.error("Error fetching NASA events:", err);
        setErrorNasa("Could not fetch real-time NASA alerts. Using simulated local points.");
        setIsLoadingNasa(false);
      });
  };

  useEffect(() => {
    fetchNasaEvents();
  }, []);

  // Sync markers list with Leaflet Map instance
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !map || !mapLoaded) return;

    // Keep track of added markers to clear them on update/unmount
    const leafletMarkersList: any[] = [];

    // Helper to generate SVG icon inside custom divIcon
    const getMarkerIconHtml = (marker: DisasterMarker) => {
      let iconSvg = "";
      if (marker.type === "dispatched") {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white rotate-45 transform"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
      } else {
        const cat = marker.category.toLowerCase();
        if (cat.includes("fire") || cat.includes("volcano")) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
        } else if (cat.includes("storm") || cat.includes("wind") || cat.includes("cyclone")) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
        } else if (cat.includes("landslide") || cat.includes("earthquake")) {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        } else {
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
        }
      }

      return `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full opacity-40" style="background-color: ${marker.color}"></span>
          <div class="w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 border-white shadow-md" style="background-color: ${marker.color}">
            ${iconSvg}
          </div>
        </div>
      `;
    };

    // Plot each marker
    markers.forEach((m) => {
      const htmlContent = getMarkerIconHtml(m);
      const icon = L.divIcon({
        html: htmlContent,
        className: "custom-leaflet-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const lMarker = L.marker([m.lat, m.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; color: #1e293b; padding: 2px; line-height: 1.4;">
            <strong style="display: block; font-size: 12px; margin-bottom: 2px; color: #0f172a;">${m.title}</strong>
            <span style="font-weight: bold; text-transform: uppercase; color: #059669; font-size: 9px;">Category: ${m.category}</span>
            <br/>
            <span style="color: #64748b; font-size: 9px;">Coordinates: Lat ${m.lat.toFixed(4)}, Lng ${m.lng.toFixed(4)}</span>
          </div>
        `);

      leafletMarkersList.push(lMarker);
    });

    return () => {
      leafletMarkersList.forEach((marker) => marker.remove());
    };
  }, [map, mapLoaded, markers]);

  // Helper to get danger level label
  const getDangerLabel = (val: number) => {
    if (val < 20) return "Low / Safe";
    if (val < 40) return "Below Average";
    if (val < 60) return "Moderate Risk";
    if (val < 80) return "High Alert";
    if (val < 95) return "Very High / Severe";
    return "Critical / Extreme Danger";
  };

  // Helper to trigger dispatch action
  const handleSendUnits = () => {
    const targetCities = [
      { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      { name: "Đà Nẵng", lat: 16.0471, lng: 108.2068 },
      { name: "TP. Hồ Chí Minh", lat: 10.7769, lng: 106.7009 }
    ];
    
    let baseCoord = targetCities[1]; // Đà Nẵng
    if (incidentType.toLowerCase().includes("landslide") || incidentType.toLowerCase().includes("fire")) {
      baseCoord = targetCities[0]; // Hà Nội
    } else if (incidentType.toLowerCase().includes("flood") || incidentType.toLowerCase().includes("medical")) {
      baseCoord = targetCities[2]; // TP. Hồ Chí Minh
    }

    // Add slight offset for visualization variance
    const latOffset = (Math.random() - 0.5) * 0.12;
    const lngOffset = (Math.random() - 0.5) * 0.12;
    const lat = baseCoord.lat + latOffset;
    const lng = baseCoord.lng + lngOffset;

    const newUnit: DisasterMarker = {
      id: `dispatched-${Date.now()}`,
      title: `${selectedUnit} Sent for ${incidentType}`,
      category: selectedUnit,
      lat: lat,
      lng: lng,
      type: "dispatched",
      color: "#059669" // Emerald green for dispatched units
    };

    setMarkers((prev) => [...prev, newUnit]);

    // Pan map dynamically to the newly dispatched unit
    if (map) {
      map.setView([lat, lng], 9);
    }

    toast.success(`Dispatched ${selectedUnit} units to Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}!`, {
      icon: () => <Shield className="w-5 h-5 text-emerald-600" />
    });
  };

  // Load details from NASA event list
  const handleSelectNasaEvent = (event: any) => {
    setIncidentType(event.category || "Natural Disaster");
    setProblemDescription(`NASA EONET Real-Time Alert: ${event.title}.\nCoordinates: Lat ${event.lat.toFixed(4)}, Lng ${event.lng.toFixed(4)}`);
    setDangerLevel(80);

    if (map && event.lat && event.lng) {
      map.setView([event.lat, event.lng], 8);
    }
    toast.info(`Zooming to NASA Alert: ${event.title}`);
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col lg:flex-row text-slate-800 font-sans">
      
      {/* SATELLITE MAP VIEW PANEL (Left Side) */}
      <div className="flex-1 relative flex items-stretch min-h-[450px] lg:min-h-0">
        
        {/* Leaflet Satellite Map Container */}
        <div 
          ref={mapContainerRef} 
          id="leaflet-map" 
          className="w-full h-full min-h-[400px] lg:min-h-0 z-10"
        />

        {/* Floating Map Actions Toolbar overlay on top of Leaflet (z-index >= 12 to overlay leaflet) */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3 z-20">
          {/* Active Call Badge overlay */}
          <div className="h-10 bg-white/95 border border-slate-200 rounded-2xl px-4 flex items-center gap-2 shadow-md backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] tracking-wide font-bold text-slate-700 uppercase">
              On the line with #39
            </span>
          </div>
        </div>

      </div>

      {/* DISPATCH CONTROL & FEEDS PANEL (Right Side) */}
      <div className="w-full lg:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto max-h-[700px] lg:max-h-none shrink-0">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Sending Units</h2>
              <p className="text-[10px] text-slate-400 font-medium">Disaster Dispatch Coordination Center</p>
            </div>
            <span className="text-sm font-bold font-mono text-emerald-600 tracking-wide bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">#39</span>
          </div>

          {/* NASA API feeds block */}
          <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                NASA EONET Real-Time Alerts
              </span>
              <button 
                onClick={fetchNasaEvents} 
                disabled={isLoadingNasa}
                className="p-1 text-slate-400 hover:text-emerald-600 disabled:opacity-50 transition-colors cursor-pointer"
                title="Refresh NASA Feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNasa ? "animate-spin" : ""}`} />
              </button>
            </div>

            {isLoadingNasa ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-[10px] text-slate-400 font-medium">Loading NASA Live Feed...</span>
              </div>
            ) : errorNasa ? (
              <span className="text-[9.5px] text-amber-600 block leading-relaxed">{errorNasa}</span>
            ) : (
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                {nasaEvents.slice(0, 5).map((ev) => (
                  <div 
                    key={ev.id}
                    onClick={() => handleSelectNasaEvent(ev)}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-bold text-slate-800 truncate block group-hover:text-emerald-700">
                        {ev.title}
                      </span>
                      <span className="text-[8px] text-slate-400 font-medium">
                        {ev.category} • {new Date(ev.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold bg-slate-100 group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 px-1.5 py-0.5 rounded-md shrink-0">
                      Load
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            
            {/* Unit type selection buttons */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Which unit to send?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Police", icon: Shield, activeClass: "border-emerald-600 text-emerald-600 bg-emerald-50/50 shadow-sm" },
                  { id: "Fire", icon: Flame, activeClass: "border-emerald-600 text-emerald-600 bg-emerald-50/50 shadow-sm" },
                  { id: "Rescue", icon: Activity, activeClass: "border-emerald-600 text-emerald-600 bg-emerald-50/50 shadow-sm" }
                ].map((unit) => {
                  const IconComp = unit.icon;
                  const isSelected = selectedUnit === unit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit.id as any)}
                      className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? unit.activeClass 
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{unit.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type of incident selector dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Type of Incident
              </label>
              <div className="relative">
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all cursor-pointer"
                >
                  <option value="Flooding">Flooding</option>
                  <option value="Landslide">Landslide / Rockfall</option>
                  <option value="Severe Typhoon">Severe Typhoon / Storm</option>
                  <option value="Wildfire">Wildfire Alert</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Other">Other Disaster Response</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* What is the problem description */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                What is the problem?
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe the incident details..."
                rows={2.5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/25 transition-all resize-none"
              />
              <span className="text-[8.5px] text-slate-400 mt-1 block">
                💡 Tip: Click anywhere on the satellite map to select target coordinates.
              </span>
            </div>

            {/* Victim Counts */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                How much victims?
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["No one", "1-4", "5-9", "Over 10"].map((opt) => {
                  const isSelected = victimCount === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setVictimCount(opt)}
                      className={`py-2 px-1 border rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                        isSelected 
                          ? "border-emerald-600 text-emerald-600 bg-emerald-50" 
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aggressors count */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                How much aggressors?
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["No one", "Single", "2-4", "Over 10"].map((opt) => {
                  const isSelected = aggressorCount === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAggressorCount(opt)}
                      className={`py-2 px-1 border rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                        isSelected 
                          ? "border-emerald-600 text-emerald-600 bg-emerald-50" 
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Danger level Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Rate the danger level
                </label>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={dangerLevel}
                onChange={(e) => setDangerLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer outline-none accent-emerald-600"
              />
              <span className="text-[10.5px] font-bold text-emerald-600 mt-2 block text-center font-mono bg-emerald-50/50 py-1 rounded-lg border border-emerald-100/50">
                {getDangerLabel(dangerLevel)}
              </span>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 hover:bg-slate-50 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Details</span>
          </button>
          
          <button 
            onClick={handleSendUnits}
            className="flex-1 py-2 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Send Units</span>
          </button>
        </div>

      </div>

    </div>
  );
}
