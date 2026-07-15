import { Radio } from "lucide-react";
import { CarIllustration } from "../components/CarIllustration";
import { GlassPanel } from "../components/GlassPanel";
import { MiniMap } from "../components/MiniMap";
import { MusicPlayer } from "../components/MusicPlayer";
import { SpeedWidget } from "../components/SpeedWidget";
import { WeatherBadge } from "../components/WeatherBadge";
import { useApp } from "../store/AppContext";

export function HomePage() {
  const { setCurrentPage, speed, setSpeed } = useApp();

  return (
    <div className="grid h-full grid-cols-[1.45fr_1fr] grid-rows-[1.25fr_0.75fr] gap-5">
      <GlassPanel className="relative overflow-hidden rounded-[2rem]">
        <div className="absolute left-8 top-8 z-10 w-52">
          <SpeedWidget speed={speed} onChange={setSpeed} compact />
        </div>
        <CarIllustration />
      </GlassPanel>

      <MiniMap onClick={() => setCurrentPage("maps")} />

      <GlassPanel className="overflow-hidden rounded-[2rem] p-7">
        <MusicPlayer compact />
      </GlassPanel>

      <div className="grid grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => setCurrentPage("weather")}
          className="text-left outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <WeatherBadge compact />
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage("radio")}
          className="grid min-h-44 place-items-center rounded-[1.5rem] border border-electric-400/30 bg-white/7 text-white shadow-glow outline-none backdrop-blur-2xl transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Radio size={54} className="text-electric-400" />
          <span className="text-3xl font-semibold">Radio</span>
        </button>
      </div>
    </div>
  );
}
