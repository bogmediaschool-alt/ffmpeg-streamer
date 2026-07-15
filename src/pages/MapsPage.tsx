import L, { LayerGroup, Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, LocateFixed, Map, Minus, Navigation, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { WeatherBadge } from "../components/WeatherBadge";
import { dortmundPosition, mapPois } from "../data/mapPois";
import { useApp } from "../store/AppContext";
import type { MapPoi, PoiCategory } from "../types";

const categories: PoiCategory[] = ["Hotel", "Hospital", "Parking", "Fuel", "Restaurant"];

function markerIcon(type: "current" | "poi" | "route" = "poi") {
  const color = type === "current" ? "#0a84ff" : type === "route" ? "#22c55e" : "#f59e0b";
  return L.divIcon({
    className: "custom-map-marker",
    html: `<span style="background:${color}"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export function MapsPage() {
  const { speed, setCurrentPage, settings } = useApp();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileRef = useRef<TileLayer | null>(null);
  const poiLayerRef = useRef<LayerGroup | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PoiCategory>("Hotel");
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);
  const [mapMode, setMapMode] = useState<"dark" | "standard">("dark");
  const [googleZoom, setGoogleZoom] = useState(14);
  const [googleCenter, setGoogleCenter] = useState<[number, number]>(dortmundPosition);
  const [googleMapType, setGoogleMapType] = useState<"roadmap" | "satellite">("roadmap");
  const useGoogleMap = settings.mapProvider === "google" && Boolean(settings.googleMapsApiKey.trim());

  const filteredPois = useMemo(
    () =>
      mapPois.filter(
        (poi) =>
          poi.category === activeCategory &&
          `${poi.name} ${poi.detail} ${poi.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [activeCategory, query],
  );

  const googleMapSrc = useMemo(() => {
    const key = encodeURIComponent(settings.googleMapsApiKey.trim());
    if (!key) return "";
    if (selectedPoi) {
      return `https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${dortmundPosition[0]},${dortmundPosition[1]}&destination=${selectedPoi.position[0]},${selectedPoi.position[1]}&mode=driving&maptype=${googleMapType}`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=${key}&center=${googleCenter[0]},${googleCenter[1]}&zoom=${googleZoom}&maptype=${googleMapType}`;
  }, [googleCenter, googleMapType, googleZoom, selectedPoi, settings.googleMapsApiKey]);

  const googleRouteUrl = selectedPoi
    ? `https://www.google.com/maps/dir/?api=1&origin=${dortmundPosition[0]},${dortmundPosition[1]}&destination=${selectedPoi.position[0]},${selectedPoi.position[1]}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${googleCenter[0]},${googleCenter[1]}`;

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(dortmundPosition, 14);

    const tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker(dortmundPosition, { icon: markerIcon("current") }).addTo(map).bindPopup("Current position: Dortmund");
    poiLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    tileRef.current = tile;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = poiLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    filteredPois.forEach((poi) => {
      L.marker(poi.position, { icon: markerIcon("poi") })
        .addTo(layer)
        .bindPopup(`${poi.name}<br>${poi.distanceKm} km · ${poi.minutes} min`)
        .on("click", () => setSelectedPoi(poi));
    });
  }, [filteredPois]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = routeLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (!selectedPoi) return;

    const route: [number, number][] = [
      dortmundPosition,
      [51.4903, 7.5462],
      [51.4889, 7.5541],
      selectedPoi.position,
    ];
    L.polyline(route, { color: "#0a84ff", weight: 7, opacity: 0.9 }).addTo(layer);
    L.marker(selectedPoi.position, { icon: markerIcon("route") }).addTo(layer);
    map.fitBounds(L.latLngBounds(route), { padding: [70, 70] });
  }, [selectedPoi]);

  useEffect(() => {
    const map = mapRef.current;
    const tile = tileRef.current;
    if (!map || !tile) return;
    const element = tile.getContainer();
    if (element) {
      element.classList.toggle("leaflet-tiles-dark", mapMode === "dark");
    }
  }, [mapMode]);

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const next: [number, number] = [position.coords.latitude, position.coords.longitude];
      setGoogleCenter(next);
      mapRef.current?.setView(next, 15);
      L.marker(next, { icon: markerIcon("current") }).addTo(mapRef.current as LeafletMap).bindPopup("Browser location").openPopup();
    });
  };

  const zoom = (direction: 1 | -1) => {
    if (useGoogleMap) {
      setGoogleZoom((value) => Math.max(3, Math.min(20, value + direction)));
      return;
    }
    if (direction === 1) mapRef.current?.zoomIn();
    else mapRef.current?.zoomOut();
  };

  const centerMap = () => {
    setGoogleCenter(dortmundPosition);
    setGoogleZoom(14);
    mapRef.current?.setView(dortmundPosition, 14);
  };

  const toggleMapMode = () => {
    setMapMode((mode) => (mode === "dark" ? "standard" : "dark"));
    setGoogleMapType((type) => (type === "roadmap" ? "satellite" : "roadmap"));
  };

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-cockpit-950 shadow-panel">
      <div ref={mapEl} className="absolute inset-0 z-0" />
      {useGoogleMap ? (
        <iframe
          title="Google Maps"
          src={googleMapSrc}
          className="absolute inset-0 z-[1] h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-10 bg-cockpit-950/10" />
      {settings.mapProvider === "google" && !settings.googleMapsApiKey.trim() ? (
        <div className="absolute left-[390px] top-5 z-20 rounded-2xl border border-yellow-300/30 bg-black/52 px-5 py-3 text-sm text-yellow-50 shadow-glow backdrop-blur-xl">
          Add your Google Maps API key in Settings. OpenStreetMap fallback is active.
        </div>
      ) : null}
      {useGoogleMap ? (
        <div className="absolute left-[390px] top-5 z-20 rounded-2xl border border-electric-400/30 bg-black/48 px-5 py-3 text-sm text-white shadow-glow backdrop-blur-xl">
          Google Maps connected with your key.
        </div>
      ) : null}

      <aside className="absolute left-5 top-1/2 z-20 flex max-h-[86%] w-[350px] -translate-y-1/2 flex-col rounded-[2rem] border border-electric-400/25 bg-cockpit-950/78 p-5 text-white shadow-glow backdrop-blur-2xl">
        <label className="flex min-h-16 items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/8 px-4 focus-within:ring-2 focus-within:ring-electric-300">
          <Search size={30} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search maps"
            className="min-w-0 flex-1 bg-transparent text-2xl outline-none placeholder:text-white/35"
          />
        </label>
        <div className="mt-5 space-y-3 overflow-auto pr-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setSelectedPoi(null);
              }}
              className={[
                "flex min-h-16 w-full items-center justify-between rounded-2xl px-4 text-left outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300",
                activeCategory === category ? "bg-electric-500/20 text-white" : "bg-white/6 text-white/82",
              ].join(" ")}
            >
              <span className="text-2xl font-semibold">{category}</span>
              <span className="text-sm text-white/45">{mapPois.filter((poi) => poi.category === category).length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-white/45">Results</p>
          <div className="space-y-2">
            {filteredPois.map((poi) => (
              <button
                key={poi.id}
                type="button"
                onClick={() => setSelectedPoi(poi)}
                className={[
                  "w-full rounded-2xl p-3 text-left outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300",
                  selectedPoi?.id === poi.id ? "bg-electric-500/20" : "bg-white/6",
                ].join(" ")}
              >
                <span className="block text-lg font-semibold">{poi.name}</span>
                <span className="text-sm text-white/55">
                  {poi.distanceKm} km · {poi.minutes} min · {poi.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="absolute right-5 top-5 z-20">
        <WeatherBadge compact />
      </div>

      <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] border border-electric-400/35 bg-white/14 shadow-glow backdrop-blur-2xl">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => zoom(1)}
          className="grid min-h-16 min-w-20 place-items-center text-white outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Plus size={28} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => zoom(-1)}
          className="grid min-h-16 min-w-20 place-items-center border-t border-white/10 text-white outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Minus size={28} />
        </button>
        <button
          type="button"
          aria-label="Center map"
          onClick={centerMap}
          className="grid min-h-16 min-w-20 place-items-center border-t border-white/10 text-white outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Navigation size={28} fill="currentColor" />
        </button>
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex items-end gap-4">
        <div className="rounded-[1.5rem] border border-electric-400/35 bg-white/14 px-7 py-4 text-center text-white shadow-glow backdrop-blur-2xl">
          <p className="text-6xl font-bold">{speed}</p>
          <p className="text-2xl text-white/80">Km/h</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={locate}
            aria-label="Use browser location"
            className="grid min-h-16 min-w-16 place-items-center rounded-full bg-electric-500 text-white shadow-glow outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <LocateFixed size={30} />
          </button>
          <button
            type="button"
            onClick={toggleMapMode}
            aria-label="Toggle map view"
            className="grid min-h-16 min-w-16 place-items-center rounded-full bg-white/14 text-white shadow-glow outline-none backdrop-blur-2xl transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <Map size={30} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("home")}
            aria-label="Close navigation"
            className="grid min-h-16 min-w-16 place-items-center rounded-full bg-electric-500 text-white shadow-glow outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <X size={34} />
          </button>
        </div>
      </div>

      {selectedPoi ? (
        <div className="absolute bottom-5 left-[390px] z-20 rounded-[1.5rem] border border-electric-400/30 bg-cockpit-950/78 p-5 text-white shadow-glow backdrop-blur-2xl">
          <p className="text-2xl font-semibold">{selectedPoi.name}</p>
          <p className="mt-1 text-white/60">{selectedPoi.detail}</p>
          <p className="mt-3 text-xl">
            Route: {selectedPoi.distanceKm} km · {selectedPoi.minutes} min
          </p>
          <a
            href={googleRouteUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-electric-500 px-4 font-semibold text-white outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <ExternalLink size={20} />
            Open in Google Maps
          </a>
        </div>
      ) : null}
    </div>
  );
}
