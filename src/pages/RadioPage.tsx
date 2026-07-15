import { Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { radioStations } from "../data/radioStations";

export function RadioPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [volume, setVolume] = useState(45);
  const station = radioStations[currentIndex];

  const move = (direction: 1 | -1) => {
    setCurrentIndex((index) => (index + direction + radioStations.length) % radioStations.length);
    setPlaying(true);
  };

  return (
    <div className="grid h-full grid-cols-[1fr_1.15fr] gap-6">
      <GlassPanel className="rounded-[2rem] p-6">
        <h1 className="text-4xl font-bold text-white">Radio</h1>
        <div className="mt-6 space-y-3">
          {radioStations.map((item, index) => (
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
