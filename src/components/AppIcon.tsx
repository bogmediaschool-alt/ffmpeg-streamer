import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AppIconProps {
  label: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
}

export function AppIcon({ label, icon: Icon, gradient, onClick }: AppIconProps) {
  return (
    <motion.button
      type="button"
      data-nav-item
      onClick={onClick}
      className="group flex min-h-36 min-w-32 flex-col items-center justify-start gap-5 rounded-[2rem] p-2 text-white outline-none transition focus-visible:ring-2 focus-visible:ring-electric-300"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span
        className="grid h-28 w-28 place-items-center rounded-[1.75rem] shadow-glow ring-1 ring-white/20 transition group-hover:brightness-110 sm:h-32 sm:w-32"
        style={{ background: gradient }}
      >
        <Icon size={58} strokeWidth={2.3} />
      </span>
      <span className="text-center text-2xl font-semibold tracking-normal text-white">{label}</span>
    </motion.button>
  );
}
