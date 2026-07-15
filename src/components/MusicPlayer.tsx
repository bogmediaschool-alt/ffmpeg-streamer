import { motion } from "framer-motion";
import { Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { tracks } from "../data/tracks";
import { useApp } from "../store/AppContext";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function MusicPlayer({ compact = false }: { compact?: boolean }) {
  const { currentTrackId, setCurrentTrackId, favoriteTrackIds, toggleFavoriteTrack } = useApp();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(38);
  const currentIndex = tracks.findIndex((track) => track.id === currentTrackId);
  const track = useMemo(() => tracks[Math.max(0, currentIndex)], [currentIndex]);

  useEffect(() => {
    setProgress(0);
  }, [currentTrackId]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value + 1 >= track.duration) {
          setPlaying(false);
          return track.duration;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, track.duration]);

  const chooseTrack = (direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    setCurrentTrackId(tracks[nextIndex].id);
    setPlaying(true);
  };

  return (
    <div className={compact ? "text-white" : "flex h-full flex-col text-white"}>
      {!compact ? (
        <div
          className="mx-auto grid h-44 w-44 place-items-center rounded-[1.25rem] text-center text-xl font-bold shadow-glow"
          style={{ background: track.cover }}
        >
          {track.title}
        </div>
      ) : null}
      <div className={compact ? "" : "mt-8"}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className={compact ? "truncate text-2xl font-semibold" : "truncate text-3xl font-semibold"}>{track.title}</h2>
            <p className="mt-1 truncate text-xl text-white/55">{track.artist}</p>
          </div>
          {!compact ? (
            <button
              type="button"
              aria-label="Favorite"
              onClick={() => toggleFavoriteTrack(track.id)}
              className="grid min-h-12 min-w-12 place-items-center rounded-full outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <Heart size={30} fill={favoriteTrackIds.includes(track.id) ? "#0a84ff" : "none"} />
            </button>
          ) : null}
        </div>
        <div className="mt-5">
          <input
            aria-label="Track progress"
            type="range"
            min={0}
            max={track.duration}
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
            className="h-2 w-full accent-electric-500"
          />
          <div className="mt-2 flex justify-between text-sm font-medium text-white/85">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-10">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => chooseTrack(-1)}
            className="grid min-h-14 min-w-14 place-items-center rounded-full text-white/70 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <SkipBack size={compact ? 32 : 42} fill="currentColor" />
          </button>
          <motion.button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((value) => !value)}
            className="grid min-h-20 min-w-20 place-items-center rounded-full bg-white/28 text-white outline-none transition hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-electric-300"
            whileTap={{ scale: 0.92 }}
          >
            {playing ? <Pause size={compact ? 38 : 52} fill="currentColor" /> : <Play size={compact ? 38 : 52} fill="currentColor" />}
          </motion.button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => chooseTrack(1)}
            className="grid min-h-14 min-w-14 place-items-center rounded-full text-white/70 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <SkipForward size={compact ? 32 : 42} fill="currentColor" />
          </button>
        </div>
        {!compact ? (
          <div className="mt-8 flex items-center gap-4">
            <Volume2 size={28} />
            <input
              aria-label="Volume"
              min={0}
              max={100}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              type="range"
              className="h-2 w-full accent-electric-500"
            />
            <span className="w-10 text-right text-sm text-white/70">{volume}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
