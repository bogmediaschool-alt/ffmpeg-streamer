import L, { LayerGroup, Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Map, Minus, Navigation, Plus, Search, X } from "lucide-react";
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
  const { speed, setCurrentPage } = useApp();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileRef = useRef<TileLayer | null>(null);
  const poiLayerRef = useRef<LayerGroup | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PoiCategory>("Hotel");
  const [selectedPoi, setSelectedPoi] = useState<MapPoi | null>(null);
  const [mapMode, setMapMode] = useState<"dark" | "standard">("dark");

  const filteredPois = useMemo(
    () =>
      mapPois.filter(
        (poi) =>
          poi.category === activeCategory &&
          `${poi.name} ${poi.detail} ${poi.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [activeCategory, query],
  );

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
      mapRef.current?.setView(next, 15);
      L.marker(next, { icon: markerIcon("current") }).addTo(mapRef.current as LeafletMap).bindPopup("Browser location").openPopup();
    });
  };

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-cockpit-950 shadow-panel">
      <div ref={mapEl} className="absolute inset-0 z-0" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-cockpit-950/10" />

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
          onClick={() => mapRef.current?.zoomIn()}
          className="grid min-h-16 min-w-20 place-items-center text-white outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Plus size={28} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => mapRef.current?.zoomOut()}
          className="grid min-h-16 min-w-20 place-items-center border-t border-white/10 text-white outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Minus size={28} />
        </button>
        <button
          type="button"
          aria-label="Center map"
          onClick={() => mapRef.current?.setView(dortmundPosition, 14)}
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
            onClick={() => setMapMode((mode) => (mode === "dark" ? "standard" : "dark"))}
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
        </div>
      ) : null}
    </div>
  );
}
