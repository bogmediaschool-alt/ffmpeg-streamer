import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({ open, title, children, onClose, className = "" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/58 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={`relative w-full max-w-lg rounded-[2rem] border border-electric-400/35 bg-cockpit-950/92 p-7 text-white shadow-glow ${className}`}
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 18 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-5 top-5 grid min-h-12 min-w-12 place-items-center rounded-full bg-white/8 text-white outline-none ring-1 ring-white/10 transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <X size={24} />
            </button>
            {title ? <h2 className="mb-5 pr-14 text-3xl font-semibold">{title}</h2> : null}
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
