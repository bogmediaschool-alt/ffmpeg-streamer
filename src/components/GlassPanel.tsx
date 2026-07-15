import { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
}

export function GlassPanel({ children, className = "", strong = false, ...props }: GlassPanelProps) {
  return (
    <div
      className={[
        "border border-white/10 bg-cockpit-950/62 shadow-panel backdrop-blur-2xl",
        strong ? "ring-1 ring-electric-400/35" : "ring-1 ring-white/5",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
