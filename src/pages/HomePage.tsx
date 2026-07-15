import { ImagePlus, Radio, RotateCcw } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { CarIllustration } from "../components/CarIllustration";
import { GlassPanel } from "../components/GlassPanel";
import { MiniMap } from "../components/MiniMap";
import { MusicPlayer } from "../components/MusicPlayer";
import { SpeedWidget } from "../components/SpeedWidget";
import { WeatherBadge } from "../components/WeatherBadge";
import { useApp } from "../store/AppContext";

export function HomePage() {
  const { setCurrentPage, speed, setSpeed, settings, updateSettings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCarPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        updateSettings({ carPhoto: reader.result });
      }
    });
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="grid h-full grid-cols-[1.45fr_1fr] grid-rows-[1.25fr_0.75fr] gap-5">
      <GlassPanel className="relative overflow-hidden rounded-[2rem]">
        <div className="absolute left-8 top-8 z-10 w-52">
          <SpeedWidget speed={speed} onChange={setSpeed} compact />
        </div>
        {settings.carPhoto ? (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(180deg,rgba(5,12,24,.88),rgba(10,42,58,.72))]">
            <img src={settings.carPhoto} alt="Custom car" className="h-full w-full object-cover opacity-95" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,18,.08),rgba(3,9,18,.45))]" />
          </div>
        ) : (
          <CarIllustration />
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCarPhoto} />
        <div className="absolute bottom-6 right-6 z-20 flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-12 items-center gap-2 rounded-full border border-electric-400/35 bg-cockpit-950/68 px-4 font-semibold text-white outline-none backdrop-blur-xl transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            <ImagePlus size={21} />
            Car photo
          </button>
          {settings.carPhoto ? (
            <button
              type="button"
              aria-label="Reset car photo"
              onClick={() => updateSettings({ carPhoto: "" })}
              className="grid min-h-12 min-w-12 place-items-center rounded-full border border-white/12 bg-cockpit-950/68 text-white outline-none backdrop-blur-xl transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <RotateCcw size={21} />
            </button>
          ) : null}
        </div>
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
