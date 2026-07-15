import { CloudSun, Droplets, Wind } from "lucide-react";
import { useWeatherData } from "../hooks/useWeatherData";
import { useApp } from "../store/AppContext";
import { cToDisplay } from "../utils/weather";

export function WeatherBadge({ compact = false }: { compact?: boolean }) {
  const { settings } = useApp();
  const { weather, source } = useWeatherData(settings);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/28 p-5 text-white backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <CloudSun className="text-sky-300" size={compact ? 34 : 44} />
        <div>
          <p className="text-electric-500">{weather.city}</p>
          <p className={compact ? "text-4xl font-bold" : "text-5xl font-bold"}>
            {cToDisplay(weather.temperature, settings.temperatureUnit)}
          </p>
        </div>
      </div>
      {!compact ? (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
          <span>{weather.condition}</span>
          <span className="flex items-center gap-2">
            <Droplets size={16} /> {weather.humidity}%
          </span>
          <span>Feels {cToDisplay(weather.feelsLike, settings.temperatureUnit)}</span>
          <span className="flex items-center gap-2">
            <Wind size={16} /> {weather.wind}
          </span>
          <span className="col-span-2 text-white/40">{source === "apple" ? "Apple WeatherKit" : "Mock weather"}</span>
        </div>
      ) : null}
    </div>
  );
}
