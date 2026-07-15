import { MapPin } from "lucide-react";

interface MiniMapProps {
  onClick?: () => void;
}

export function MiniMap({ onClick }: MiniMapProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative min-h-48 overflow-hidden rounded-[2rem] border border-electric-400/25 bg-[#203042] text-left outline-none ring-1 ring-white/5 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-electric-300"
    >
      <div className="absolute inset-0 bg-[linear-gradient(28deg,transparent_0_45%,rgba(87,114,145,.7)_45%_47%,transparent_47%),linear-gradient(112deg,transparent_0_30%,rgba(102,130,160,.85)_30%_32%,transparent_32%),linear-gradient(160deg,transparent_0_65%,rgba(102,130,160,.65)_65%_67%,transparent_67%)]" />
      <div className="absolute inset-0 opacity-85">
        <div className="absolute left-10 top-8 h-24 w-36 rotate-12 rounded-lg bg-emerald-800/70" />
        <div className="absolute bottom-10 right-8 h-28 w-44 -rotate-12 rounded-lg bg-teal-800/70" />
        <div className="absolute bottom-2 left-8 h-24 w-40 rounded-lg bg-cyan-900/70" />
      </div>
      <span className="absolute left-[52%] top-[43%] grid h-12 w-12 place-items-center rounded-full bg-electric-500 ring-8 ring-white/70">
        <span className="h-4 w-4 rounded-full bg-white" />
      </span>
      <span className="absolute bottom-5 left-5 flex items-center gap-2 text-2xl font-semibold text-white">
        <MapPin size={26} fill="currentColor" />
        Maps
      </span>
      <span className="absolute bottom-6 left-32 text-sm text-white/55">OpenStreetMap</span>
    </button>
  );
}
