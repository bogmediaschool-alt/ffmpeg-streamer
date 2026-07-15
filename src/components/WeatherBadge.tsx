import { CloudSun, Droplets, Wind } from "lucide-react";
import { defaultWeather } from "../data/weather";
import { useApp } from "../store/AppContext";
import { cToDisplay } from "../utils/weather";

export function WeatherBadge({ compact = false }: { compact?: boolean }) {
  const { settings } = useApp();

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/28 p-5 text-white backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <CloudSun className="text-sky-300" size={compact ? 34 : 44} />
        <div>
          <p className="text-electric-500">{defaultWeather.city}</p>
          <p className={compact ? "text-4xl font-bold" : "text-5xl font-bold"}>
            {cToDisplay(defaultWeather.temperature, settings.temperatureUnit)}
          </p>
        </div>
      </div>
      {!compact ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
          <span>{defaultWeather.condition}</span>
          <span className="flex items-center gap-2">
            <Droplets size={16} /> {defaultWeather.humidity}%
          </span>
          <span>Feels {cToDisplay(defaultWeather.feelsLike, settings.temperatureUnit)}</span>
          <span className="flex items-center gap-2">
            <Wind size={16} /> {defaultWeather.wind}
          </span>
        </div>
      ) : null}
    </div>
  );
}
