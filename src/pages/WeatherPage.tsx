import { CloudSun, Droplets, ThermometerSun, Wind } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { defaultWeather } from "../data/weather";
import { useApp } from "../store/AppContext";
import { cToDisplay } from "../utils/weather";

export function WeatherPage() {
  const { settings } = useApp();

  return (
    <GlassPanel className="h-full rounded-[2rem] p-8 text-white">
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="flex flex-col justify-center">
          <p className="text-2xl font-semibold text-electric-400">{defaultWeather.city}</p>
          <div className="mt-4 flex items-center gap-6">
            <CloudSun size={118} className="text-sky-300" />
            <div>
              <p className="text-8xl font-bold">{cToDisplay(defaultWeather.temperature, settings.temperatureUnit)}</p>
              <p className="mt-2 text-3xl text-white/72">{defaultWeather.condition}</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/8 p-5">
              <ThermometerSun className="text-electric-400" />
              <p className="mt-3 text-white/55">Feels like</p>
              <p className="text-2xl font-semibold">{cToDisplay(defaultWeather.feelsLike, settings.temperatureUnit)}</p>
            </div>
            <div className="rounded-2xl bg-white/8 p-5">
              <Droplets className="text-electric-400" />
              <p className="mt-3 text-white/55">Humidity</p>
              <p className="text-2xl font-semibold">{defaultWeather.humidity}%</p>
            </div>
            <div className="rounded-2xl bg-white/8 p-5">
              <Wind className="text-electric-400" />
              <p className="mt-3 text-white/55">Wind</p>
              <p className="text-2xl font-semibold">{defaultWeather.wind}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold">5 day forecast</h2>
          <div className="mt-6 space-y-4">
            {defaultWeather.forecast.map((day) => (
              <div key={day.day} className="flex min-h-20 items-center justify-between rounded-2xl bg-white/8 px-6">
                <span className="w-24 text-2xl font-semibold">{day.day}</span>
                <span className="flex items-center gap-3 text-xl text-white/72">
                  <CloudSun className="text-sky-300" /> {day.condition}
                </span>
                <span className="text-2xl font-bold">
                  {cToDisplay(day.high, settings.temperatureUnit)} / {cToDisplay(day.low, settings.temperatureUnit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
