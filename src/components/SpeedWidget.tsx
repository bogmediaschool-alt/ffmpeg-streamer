import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Gauge } from "lucide-react";
import { useEffect } from "react";

interface SpeedWidgetProps {
  speed: number;
  onChange: (value: number) => void;
  compact?: boolean;
}

export function SpeedWidget({ speed, onChange, compact = false }: SpeedWidgetProps) {
  const value = useMotionValue(speed);
  const spring = useSpring(value, { stiffness: 120, damping: 18 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    value.set(speed);
  }, [speed, value]);

  return (
    <div
      className={[
        "rounded-[1.75rem] border border-electric-400/30 bg-white/7 text-white shadow-glow backdrop-blur-2xl",
        compact ? "p-4" : "p-6",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 text-electric-400">
        <Gauge size={compact ? 22 : 28} />
        <span className="text-sm font-semibold uppercase tracking-[0.18em]">Speed</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <motion.span className={compact ? "text-6xl font-bold" : "text-7xl font-bold"}>{rounded}</motion.span>
        <span className="pb-2 text-2xl font-medium text-white/85">Km/h</span>
      </div>
      {!compact ? (
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(speed - 10)}
            className="grid min-h-12 min-w-12 place-items-center rounded-full bg-white/10 text-2xl outline-none ring-1 ring-white/12 transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            -
          </button>
          <input
            aria-label="Demo speed"
            type="range"
            min={0}
            max={240}
            value={speed}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-2 w-full accent-electric-500"
          />
          <button
            type="button"
            onClick={() => onChange(speed + 10)}
            className="grid min-h-12 min-w-12 place-items-center rounded-full bg-white/10 text-2xl outline-none ring-1 ring-white/12 transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            +
          </button>
        </div>
      ) : null}
    </div>
  );
}
