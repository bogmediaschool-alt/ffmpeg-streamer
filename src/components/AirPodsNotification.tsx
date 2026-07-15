import { AnimatePresence, motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../store/AppContext";

export function AirPodsNotification() {
  const { settings } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!settings.airPodsNotification) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 4200);
    const interval = window.setInterval(() => {
      setVisible(true);
      window.setTimeout(() => setVisible(false), 4200);
    }, 24000);

    return () => {
      window.clearTimeout(hide);
      window.clearInterval(interval);
    };
  }, [settings.airPodsNotification]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          className="pointer-events-none absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-4 rounded-[1.6rem] border border-white/10 bg-black/35 px-7 py-3 text-white shadow-glow backdrop-blur-2xl"
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white">
            <Headphones size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-tight">AirPods Pro</p>
            <p className="text-lg font-semibold leading-tight text-white/70">Connected</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
