import { CloudSun, LogOut, Map, Music2, Phone, Radio, Youtube } from "lucide-react";
import { useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import { Modal } from "../components/Modal";
import { useKeyboardGrid } from "../hooks/useKeyboardGrid";
import { useApp } from "../store/AppContext";
import type { AppShortcut, PageId } from "../types";

const shortcuts: AppShortcut[] = [
  { id: "phone", label: "Phone", icon: Phone, gradient: "linear-gradient(135deg, #49f261, #11bf33)" },
  { id: "music", label: "Music", icon: Music2, gradient: "linear-gradient(135deg, #ff6574, #ef233c)" },
  { id: "maps", label: "Maps", icon: Map, gradient: "linear-gradient(135deg, #ff6961 0 22%, #f9c74f 22% 43%, #f8f9fa 43% 55%, #4ade80 55% 100%)" },
  { id: "weather", label: "Weather", icon: CloudSun, gradient: "linear-gradient(135deg, #2993ff, #70e1ff)" },
  { id: "radio", label: "Radio", icon: Radio, gradient: "linear-gradient(135deg, #d946ef, #7c3aed)" },
  { id: "youtube", label: "YouTube", icon: Youtube, gradient: "linear-gradient(135deg, #ff1744, #e60023)" },
  { id: "exit", label: "Exit", icon: LogOut, gradient: "linear-gradient(135deg, #425466, #233243)" },
];

export function AppsPage() {
  const { setCurrentPage, setSystemOn } = useApp();
  const [confirmExit, setConfirmExit] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  useKeyboardGrid(gridRef, "[data-nav-item]");

  const openShortcut = (id: AppShortcut["id"]) => {
    if (id === "exit") {
      setConfirmExit(true);
      return;
    }
    setCurrentPage(id as PageId);
  };

  return (
    <div className="h-full rounded-[2.25rem] border border-electric-400/55 bg-white/5 p-8 shadow-glow backdrop-blur-2xl">
      <div ref={gridRef} data-columns="4" className="grid h-full grid-cols-2 place-content-center gap-x-12 gap-y-8 md:grid-cols-4">
        {shortcuts.map((shortcut) => (
          <AppIcon key={shortcut.id} {...shortcut} onClick={() => openShortcut(shortcut.id)} />
        ))}
      </div>

      <Modal open={confirmExit} title="Exit Car Interface?" onClose={() => setConfirmExit(false)}>
        <p className="text-lg text-white/70">The simulator will show a dark standby screen. You can start the system again anytime.</p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmExit(false)}
            className="min-h-12 rounded-full bg-white/10 px-6 font-semibold outline-none transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmExit(false);
              setSystemOn(false);
            }}
            className="min-h-12 rounded-full bg-electric-500 px-6 font-semibold outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            Exit
          </button>
        </div>
      </Modal>
    </div>
  );
}
