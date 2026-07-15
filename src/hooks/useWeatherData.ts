import { useEffect, useState } from "react";
import { defaultWeather } from "../data/weather";
import type { Settings, WeatherData } from "../types";

const berghofen = { lat: 51.4768, lon: 7.5525 };

function normalizeCondition(condition?: string) {
  if (!condition) return defaultWeather.condition;
  return condition
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function toWeatherData(payload: WeatherKitPayload): WeatherData {
  const current = payload.currentWeather;
  const days = payload.forecastDaily?.days ?? [];

  return {
    city: "Berghofen",
    temperature: current?.temperature ?? defaultWeather.temperature,
    condition: normalizeCondition(current?.conditionCode),
    feelsLike: current?.apparentTemperature ?? defaultWeather.feelsLike,
    humidity: current?.humidity ? Math.round(current.humidity * 100) : defaultWeather.humidity,
    wind: current?.windSpeed ? `${Math.round(current.windSpeed)} km/h` : defaultWeather.wind,
    forecast: days.length
      ? days.slice(0, 5).map((day) => ({
          day: new Date(day.forecastStart).toLocaleDateString("en", { weekday: "short" }),
          high: day.temperatureMax,
          low: day.temperatureMin,
          condition: normalizeCondition(day.conditionCode),
        }))
      : defaultWeather.forecast,
  };
}

export function useWeatherData(settings: Settings) {
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);
  const [source, setSource] = useState<"mock" | "apple">("mock");
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings.weatherProvider !== "apple" || !settings.appleWeatherToken.trim()) {
      setWeather(defaultWeather);
      setSource("mock");
      setError("");
      return;
    }

    const controller = new AbortController();
    const url = `https://weatherkit.apple.com/api/v1/weather/en/${berghofen.lat}/${berghofen.lon}?dataSets=currentWeather,forecastDaily&timezone=Europe/Berlin`;

    fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${settings.appleWeatherToken.trim()}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`WeatherKit returned ${response.status}`);
        return response.json() as Promise<WeatherKitPayload>;
      })
      .then((payload) => {
        setWeather(toWeatherData(payload));
        setSource("apple");
        setError("");
      })
      .catch((fetchError: Error) => {
        if (controller.signal.aborted) return;
        setWeather(defaultWeather);
        setSource("mock");
        setError(fetchError.message);
      });

    return () => controller.abort();
  }, [settings.appleWeatherToken, settings.weatherProvider]);

  return { weather, source, error };
}

interface WeatherKitPayload {
  currentWeather?: {
    temperature?: number;
    apparentTemperature?: number;
    humidity?: number;
    windSpeed?: number;
    conditionCode?: string;
  };
  forecastDaily?: {
    days?: Array<{
      forecastStart: string;
      temperatureMax: number;
      temperatureMin: number;
      conditionCode?: string;
    }>;
  };
}
