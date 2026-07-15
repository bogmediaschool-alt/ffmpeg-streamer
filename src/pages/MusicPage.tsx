import { ExternalLink, Heart, Link2, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { MusicPlayer } from "../components/MusicPlayer";
import { tracks } from "../data/tracks";
import { useKeyboardGrid } from "../hooks/useKeyboardGrid";
import { useApp } from "../store/AppContext";
import type { MusicService, Track } from "../types";

type MusicTab = MusicService | "Favorites";

const musicTabs: MusicTab[] = ["YouTube Music", "Apple Music", "Spotify", "Favorites"];
const serviceLinks: Record<MusicService, string> = {
  "YouTube Music": "https://music.youtube.com/",
  "Apple Music": "https://music.apple.com/",
  Spotify: "https://open.spotify.com/",
};

export function MusicPage() {
  const { favoriteTrackIds, toggleFavoriteTrack, currentTrackId, setCurrentTrackId, settings, updateSettings } = useApp();
  const [tab, setTab] = useState<MusicTab>("YouTube Music");
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  useKeyboardGrid(listRef);

  const visibleTracks = useMemo(() => {
    return tracks.filter((track) => {
      const tabMatch =
        tab === "Favorites" ? favoriteTrackIds.includes(track.id) : track.source === tab;
      const queryMatch = `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase());
      return tabMatch && queryMatch;
    });
  }, [favoriteTrackIds, query, tab]);

  const renderTrack = (track: Track) => (
    <button
      key={track.id}
      type="button"
      data-nav-item
      onClick={() => setCurrentTrackId(track.id)}
      className={[
        "flex min-h-20 w-full items-center gap-4 rounded-2xl px-3 text-left outline-none transition hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-electric-300",
        currentTrackId === track.id ? "bg-electric-500/14" : "",
      ].join(" ")}
    >
      <span className="h-16 w-16 shrink-0 rounded-2xl shadow" style={{ background: track.cover }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-2xl font-semibold text-white">{track.title}</span>
        <span className="block truncate text-lg text-white/50">{track.artist}</span>
      </span>
      <button
        type="button"
        aria-label={`Favorite ${track.title}`}
        onClick={(event) => {
          event.stopPropagation();
          toggleFavoriteTrack(track.id);
        }}
        className="grid min-h-12 min-w-12 place-items-center rounded-full text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
      >
        <Heart size={34} fill={favoriteTrackIds.includes(track.id) ? "#0a84ff" : "none"} />
      </button>
    </button>
  );

  return (
    <div className="grid h-full grid-cols-[0.92fr_1.1fr] gap-6">
      <GlassPanel className="rounded-[2rem] p-8">
        <MusicPlayer />
      </GlassPanel>

      <GlassPanel className="flex min-h-0 flex-col rounded-[2rem] p-6">
        <div className="grid grid-cols-4 rounded-[1.6rem] bg-white/8 p-1">
          {musicTabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={[
                "min-h-14 rounded-[1.35rem] px-3 text-xl font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-electric-300",
                tab === item ? "bg-white/35 text-white" : "text-white/88 hover:bg-white/10",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>
        {tab !== "Favorites" ? (
          <div className="mt-4 flex min-h-14 items-center gap-3 rounded-[1.35rem] bg-black/22 px-4">
            <Link2 size={22} className="text-electric-400" />
            <span className="flex-1 text-white/70">
              {settings.musicConnections[tab] ? `${tab} account connected` : `Connect your ${tab} account`}
            </span>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  musicConnections: {
                    ...settings.musicConnections,
                    [tab]: !settings.musicConnections[tab],
                  },
                })
              }
              className="min-h-11 rounded-full bg-electric-500 px-4 font-semibold outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              {settings.musicConnections[tab] ? "Disconnect" : "Connect"}
            </button>
            <a
              href={serviceLinks[tab]}
              target="_blank"
              rel="noreferrer"
              className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white/8 outline-none transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
              aria-label={`Open ${tab}`}
            >
              <ExternalLink size={21} />
            </a>
          </div>
        ) : null}
        <label className="mt-5 flex min-h-16 items-center gap-4 rounded-[1.5rem] border border-electric-400/35 bg-white/6 px-5 text-white focus-within:ring-2 focus-within:ring-electric-300">
          <Search size={34} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-3xl outline-none placeholder:text-white/38"
          />
        </label>
        <div ref={listRef} data-columns="1" className="mt-5 min-h-0 flex-1 space-y-2 overflow-auto pr-2">
          {visibleTracks.length ? (
            visibleTracks.map(renderTrack)
          ) : (
            <div className="rounded-2xl bg-white/6 p-6 text-xl text-white/65">No tracks in this view.</div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
