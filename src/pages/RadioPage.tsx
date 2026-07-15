import { Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { radioStations } from "../data/radioStations";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RadioStation } from "../types";

interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  tags?: string;
  countrycode?: string;
  url_resolved?: string;
  url?: string;
}

export function RadioPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stations, setStations] = useState<RadioStation[]>(radioStations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<string[]>("car-ui-favorite-radio", []);
  const [volume, setVolume] = useState(45);
  const [status, setStatus] = useState("Open radio sources");
  const station = stations[currentIndex] ?? stations[0];

  useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/stations/search?countrycode=DE&hidebroken=true&limit=8&order=votes&reverse=true")
      .then((response) => {
        if (!response.ok) throw new Error("Radio directory unavailable");
        return response.json() as Promise<RadioBrowserStation[]>;
      })
      .then((items) => {
        const openStations = items
          .filter((item) => item.url_resolved || item.url)
          .slice(0, 5)
          .map((item, index): RadioStation => ({
            id: item.stationuuid,
            frequency: `WEB ${index + 1}`,
            name: item.name || `Open Radio ${index + 1}`,
            genre: item.tags?.split(",").slice(0, 2).join(", ") || item.countrycode || "Open stream",
            streamUrl: item.url_resolved || item.url,
            source: "Radio Browser",
          }));
        if (openStations.length) {
          setStations(openStations);
          setCurrentIndex(0);
          setStatus("Loaded from Radio Browser");
        }
      })
      .catch(() => setStatus("Fallback mock stations"));
  }, []);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.pause();

    if (!station?.streamUrl) {
      if (playing) setStatus("This mock station has no live stream");
      return;
    }

    audio.src = station.streamUrl;
    audio.volume = volume / 100;
    if (!playing) return;

    audio
      .play()
      .then(() => setStatus(station.source ?? "Playing open radio stream"))
      .catch(() => {
        setPlaying(false);
        setStatus("Stream could not start in this browser");
      });
  }, [playing, station, volume]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const move = (direction: 1 | -1) => {
    setCurrentIndex((index) => (index + direction + stations.length) % stations.length);
    setPlaying(true);
  };

  return (
    <div className="grid h-full grid-cols-[1fr_1.15fr] gap-6">
      <GlassPanel className="rounded-[2rem] p-6">
        <h1 className="text-4xl font-bold text-white">Radio</h1>
        <div className="mt-6 space-y-3">
          <p className="mt-2 text-sm text-white/45">{status}</p>
          {stations.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={[
                "flex min-h-20 w-full items-center justify-between rounded-2xl px-5 text-left outline-none ring-1 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300",
                item.id === station.id ? "bg-electric-500/18 ring-electric-400/40" : "bg-white/6 ring-white/8",
              ].join(" ")}
            >
              <span>
                <span className="block text-3xl font-bold text-white">{item.frequency}</span>
                <span className="text-lg text-white/60">
                  {item.name} · {item.genre}
                </span>
                {item.source ? <span className="block text-sm text-white/38">{item.source}</span> : null}
              </span>
              <span className="grid min-h-12 min-w-12 place-items-center rounded-full bg-white/10">
                <Play size={22} fill="currentColor" />
              </span>
            </button>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="grid place-items-center rounded-[2rem] p-8 text-center text-white">
        <div>
          <p className="text-xl uppercase tracking-[0.28em] text-electric-400">FM</p>
          <p className="mt-2 text-8xl font-bold">{station.frequency}</p>
          <p className="mt-2 text-4xl font-semibold">{station.name}</p>
          <p className="mt-1 text-xl text-white/55">{station.genre}</p>
          <div className="mt-10 flex items-center justify-center gap-8">
            <button
              type="button"
              aria-label="Previous station"
              onClick={() => move(-1)}
              className="grid min-h-16 min-w-16 place-items-center rounded-full bg-white/10 outline-none transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <SkipBack size={34} fill="currentColor" />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause station" : "Play station"}
              onClick={() => setPlaying((value) => !value)}
              className="grid min-h-24 min-w-24 place-items-center rounded-full bg-electric-500 text-white shadow-glow outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              {playing ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
            </button>
            <button
              type="button"
              aria-label="Next station"
              onClick={() => move(1)}
              className="grid min-h-16 min-w-16 place-items-center rounded-full bg-white/10 outline-none transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <SkipForward size={34} fill="currentColor" />
            </button>
          </div>
          <div className="mt-9 flex items-center gap-4">
            <Volume2 size={30} />
            <input
              aria-label="Radio volume"
              value={volume}
              min={0}
              max={100}
              onChange={(event) => setVolume(Number(event.target.value))}
              type="range"
              className="h-2 w-80 accent-electric-500"
            />
            <button
              type="button"
              aria-label="Favorite station"
              onClick={() =>
                setFavorites((items) => (items.includes(station.id) ? items.filter((id) => id !== station.id) : [...items, station.id]))
              }
              className="grid min-h-12 min-w-12 place-items-center rounded-full outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <Heart size={32} fill={favorites.includes(station.id) ? "#0a84ff" : "none"} />
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
