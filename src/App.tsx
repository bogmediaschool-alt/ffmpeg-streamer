import { AnimatePresence, motion } from "framer-motion";
import { Power } from "lucide-react";
import { useEffect } from "react";
import { AirPodsNotification } from "./components/AirPodsNotification";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Sidebar } from "./components/Sidebar";
import { AppsPage } from "./pages/AppsPage";
import { HomePage } from "./pages/HomePage";
import { MapsPage } from "./pages/MapsPage";
import { MusicPage } from "./pages/MusicPage";
import { PhonePage } from "./pages/PhonePage";
import { RadioPage } from "./pages/RadioPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WeatherPage } from "./pages/WeatherPage";
import { YouTubePage } from "./pages/YouTubePage";
import { AppProvider, useApp } from "./store/AppContext";
import type { PageId } from "./types";

const pageComponents: Record<PageId, JSX.Element> = {
  home: <HomePage />,
  apps: <AppsPage />,
  maps: <MapsPage />,
  phone: <PhonePage />,
  music: <MusicPage />,
  radio: <RadioPage />,
  weather: <WeatherPage />,
  youtube: <YouTubePage />,
  settings: <SettingsPage />,
};

function AppShell() {
  const { currentPage, settings, systemOn, setSystemOn } = useApp();

  useEffect(() => {
    if (!settings.buttonSounds) return;

    let audioContext: AudioContext | null = null;
    const playClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("button")) return;
      audioContext ??= new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = 540;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.045);
    };

    window.addEventListener("click", playClick);
    return () => {
      window.removeEventListener("click", playClick);
      audioContext?.close();
    };
  }, [settings.buttonSounds]);

  if (!systemOn) {
    return (
      <div className="grid min-h-screen place-items-center bg-black p-6 text-white">
        <button
          type="button"
          onClick={() => setSystemOn(true)}
          className="flex min-h-16 items-center gap-4 rounded-full border border-electric-400/35 bg-white/8 px-8 text-2xl font-semibold outline-none shadow-glow transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
        >
          <Power size={32} />
          Start system
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_72%,rgba(20,184,166,.55),transparent_34%),linear-gradient(115deg,#07111d_0%,#12366b_38%,#087f92_100%)] p-3 font-display text-white sm:p-5">
      <div className="portrait-hint fixed inset-x-5 top-5 z-50 rounded-2xl border border-electric-400/35 bg-cockpit-950/88 p-4 text-center text-sm text-white shadow-glow backdrop-blur-xl">
        Rotate your device for the best car display.
      </div>
      <div className="h-[calc(100vh-1.5rem)] overflow-x-auto overflow-y-hidden sm:h-[calc(100vh-2.5rem)]">
        <main
          className="relative mx-auto flex aspect-video h-full min-h-[540px] min-w-[980px] max-w-[1760px] gap-5 rounded-[2.6rem] p-3"
          style={{ filter: `brightness(${settings.brightness}%)` }}
        >
          <AirPodsNotification />
          <Sidebar />
          <section className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.985, x: 16 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.985, x: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full"
              >
                {pageComponents[currentPage]}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
