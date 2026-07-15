import type { LucideIcon } from "lucide-react";

export type PageId =
  | "home"
  | "apps"
  | "maps"
  | "phone"
  | "music"
  | "radio"
  | "weather"
  | "youtube"
  | "settings";

export type Language = "en" | "uk" | "de";
export type TemperatureUnit = "c" | "f";
export type MapProvider = "openstreetmap" | "google";
export type WeatherProvider = "mock" | "apple";
export type MusicService = "YouTube Music" | "Apple Music" | "Spotify";

export interface Settings {
  language: Language;
  temperatureUnit: TemperatureUnit;
  darkTheme: boolean;
  brightness: number;
  buttonSounds: boolean;
  demoSpeed: number;
  carPhoto: string;
  mapProvider: MapProvider;
  googleMapsApiKey: string;
  weatherProvider: WeatherProvider;
  appleWeatherToken: string;
  musicConnections: Record<MusicService, boolean>;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  source: MusicService;
  duration: number;
  cover: string;
  audioUrl?: string;
}

export interface RadioStation {
  id: string;
  frequency: string;
  name: string;
  genre: string;
  streamUrl?: string;
  source?: string;
}

export interface WeatherDay {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  wind: string;
  forecast: WeatherDay[];
}

export interface MapPoi {
  id: string;
  category: PoiCategory;
  name: string;
  detail: string;
  position: [number, number];
  distanceKm: number;
  minutes: number;
}

export type PoiCategory = "Hotel" | "Hospital" | "Parking" | "Fuel" | "Restaurant";

export interface VideoItem {
  id: string;
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  embedUrl?: string;
}

export interface AppShortcut {
  id: PageId | "exit";
  label: string;
  icon: LucideIcon;
  gradient: string;
}
