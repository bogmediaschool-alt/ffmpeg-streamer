import type { WeatherData } from "../types";

export const defaultWeather: WeatherData = {
  city: "Berghofen",
  temperature: 22.2,
  condition: "Мінлива хмарність",
  feelsLike: 23.1,
  humidity: 58,
  wind: "11 km/h NW",
  forecast: [
    { day: "Today", high: 24, low: 16, condition: "Partly cloudy" },
    { day: "Wed", high: 22, low: 15, condition: "Cloudy" },
    { day: "Thu", high: 25, low: 17, condition: "Sunny" },
    { day: "Fri", high: 21, low: 14, condition: "Light rain" },
    { day: "Sat", high: 23, low: 15, condition: "Clear" },
  ],
};
