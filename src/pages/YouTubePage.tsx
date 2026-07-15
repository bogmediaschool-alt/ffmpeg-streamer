import { Play, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { videos } from "../data/videos";
import type { VideoItem } from "../types";

export function YouTubePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const filtered = useMemo(
    () => videos.filter((video) => `${video.title} ${video.author}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="h-full rounded-[2rem] border border-white/10 bg-cockpit-950/70 p-7 text-white shadow-panel backdrop-blur-2xl">
      <label className="flex min-h-16 items-center gap-4 rounded-[1.5rem] border border-electric-400/35 bg-white/6 px-5 focus-within:ring-2 focus-within:ring-electric-300">
        <Search size={34} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search videos"
          className="min-w-0 flex-1 bg-transparent text-3xl outline-none placeholder:text-white/38"
        />
      </label>
      <div className="mt-6 grid grid-cols-3 gap-5">
        {filtered.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setSelected(video)}
            className="overflow-hidden rounded-[1.5rem] bg-white/7 text-left outline-none ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <div className="relative h-44" style={{ background: video.thumbnail }}>
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-red-600/95">
                  <Play size={38} fill="currentColor" />
                </span>
              </span>
              <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-sm font-semibold">{video.duration}</span>
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-semibold">{video.title}</h2>
              <p className="mt-1 text-lg text-white/55">{video.author}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal open={Boolean(selected)} title={selected?.title} onClose={() => setSelected(null)} className="max-w-3xl">
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          {selected?.embedUrl ? (
            <iframe
              title={selected.title}
              src={selected.embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="grid h-full place-items-center text-center"
              style={{ background: selected?.thumbnail }}
            >
              <div className="rounded-2xl bg-black/55 p-6 backdrop-blur">
                <Play className="mx-auto" size={64} fill="currentColor" />
                <p className="mt-3 text-xl">Demo preview only</p>
                <p className="mt-1 text-white/65">Real playback should use official iframe embeds for allowed videos.</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
