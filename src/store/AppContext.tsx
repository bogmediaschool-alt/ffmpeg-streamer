/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import { defaultContacts } from "../data/contacts";
import { tracks } from "../data/tracks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Contact, PageId, Settings } from "../types";

const defaultSettings: Settings = {
  language: "uk",
  temperatureUnit: "c",
  darkTheme: true,
  brightness: 92,
  buttonSounds: false,
  demoSpeed: 0,
  airPodsNotification: true,
};

interface AppContextValue {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  previousPage: PageId;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  resetData: () => void;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  favoriteTrackIds: string[];
  toggleFavoriteTrack: (id: string) => void;
  currentTrackId: string;
  setCurrentTrackId: (id: string) => void;
  speed: number;
  setSpeed: (value: number) => void;
  systemOn: boolean;
  setSystemOn: (value: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setPage] = useState<PageId>("home");
  const [previousPage, setPreviousPage] = useState<PageId>("home");
  const [settings, setSettings] = useLocalStorage<Settings>("car-ui-settings", defaultSettings);
  const [contacts, setContacts] = useLocalStorage<Contact[]>("car-ui-contacts", defaultContacts);
  const [favoriteTrackIds, setFavoriteTrackIds] = useLocalStorage<string[]>("car-ui-favorite-tracks", []);
  const [currentTrackId, setCurrentTrackId] = useLocalStorage<string>("car-ui-current-track", tracks[4].id);
  const [speed, setSpeedState] = useState(settings.demoSpeed);
  const [systemOn, setSystemOn] = useState(true);

  const setCurrentPage = (page: PageId) => {
    setPreviousPage(currentPage);
    setPage(page);
  };

  const updateSettings = (nextSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...nextSettings }));
    if (typeof nextSettings.demoSpeed === "number") setSpeedState(nextSettings.demoSpeed);
  };

  const setSpeed = (value: number) => {
    const clamped = Math.max(0, Math.min(240, Math.round(value)));
    setSpeedState(clamped);
    setSettings((prev) => ({ ...prev, demoSpeed: clamped }));
  };

  const resetData = () => {
    setSettings(defaultSettings);
    setContacts(defaultContacts);
    setFavoriteTrackIds([]);
    setCurrentTrackId(tracks[4].id);
    setSpeedState(0);
  };

  const toggleFavoriteTrack = (id: string) => {
    setFavoriteTrackIds((prev) => (prev.includes(id) ? prev.filter((trackId) => trackId !== id) : [...prev, id]));
  };

  const value: AppContextValue = {
    currentPage,
    setCurrentPage,
    previousPage,
    settings,
    updateSettings,
    resetData,
    contacts,
    setContacts,
    favoriteTrackIds,
    toggleFavoriteTrack,
    currentTrackId,
    setCurrentTrackId,
    speed,
    setSpeed,
    systemOn,
    setSystemOn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
