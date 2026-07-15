import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, Home, Music2, Navigation, Phone, Radio, Settings } from "lucide-react";
import { useApp } from "../store/AppContext";
import type { PageId } from "../types";

const navItems: Array<{ page: PageId; label: string; icon: typeof Home }> = [
  { page: "home", label: "Home", icon: Home },
  { page: "music", label: "Music", icon: Music2 },
  { page: "maps", label: "Maps", icon: Navigation },
  { page: "phone", label: "Phone", icon: Phone },
  { page: "radio", label: "Radio", icon: Radio },
  { page: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage } = useApp();

  return (
    <aside className="flex h-full w-[88px] shrink-0 flex-col items-center rounded-[2.25rem] border border-electric-400/30 bg-white/7 px-3 py-5 shadow-glow backdrop-blur-2xl sm:w-[104px]">
      <div className="flex flex-1 flex-col items-center justify-between gap-3">
        {navItems.map(({ page, label, icon: Icon }) => {
          const active = currentPage === page;
          return (
            <motion.button
              key={page}
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              title={label}
              onClick={() => setCurrentPage(page)}
              className="relative grid min-h-14 min-w-14 place-items-center rounded-full text-white outline-none transition focus-visible:ring-2 focus-visible:ring-electric-300 sm:min-h-16 sm:min-w-16"
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence>
                {active ? (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-full border border-electric-300/60 bg-white/13 shadow-glow"
                    initial={{ opacity: 0.4, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                  />
                ) : null}
              </AnimatePresence>
              <Icon className={active ? "relative text-electric-500" : "relative text-white"} size={31} fill={active ? "currentColor" : "none"} />
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        aria-label="Apps"
        title="Apps"
        onClick={() => setCurrentPage("apps")}
        className={[
          "mt-5 grid min-h-20 min-w-20 place-items-center rounded-full outline-none ring-1 transition focus-visible:ring-2 focus-visible:ring-electric-300",
          currentPage === "apps"
            ? "bg-electric-500/22 text-electric-500 ring-electric-300/60 shadow-glow"
            : "bg-white/8 text-white ring-white/12 hover:bg-white/14",
        ].join(" ")}
        whileTap={{ scale: 0.94 }}
      >
        <Grid3X3 size={34} fill="currentColor" />
      </motion.button>
    </aside>
  );
}
