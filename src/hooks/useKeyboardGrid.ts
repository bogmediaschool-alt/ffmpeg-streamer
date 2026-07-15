import { RefObject, useEffect } from "react";

export function useKeyboardGrid<T extends HTMLElement>(ref: RefObject<T>, itemSelector = "[data-nav-item]") {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter"];
      if (!keys.includes(event.key)) return;

      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector)).filter(
        (item) => !item.hasAttribute("disabled"),
      );
      if (!items.length) return;

      const active = document.activeElement as HTMLElement | null;
      const currentIndex = active ? items.indexOf(active) : -1;
      const columns = Number(container.dataset.columns || "1");
      let nextIndex = currentIndex >= 0 ? currentIndex : 0;

      if (event.key === "ArrowRight") nextIndex += 1;
      if (event.key === "ArrowLeft") nextIndex -= 1;
      if (event.key === "ArrowDown") nextIndex += columns;
      if (event.key === "ArrowUp") nextIndex -= columns;
      if (event.key === "Enter" && currentIndex >= 0) {
        event.preventDefault();
        active?.click();
        return;
      }

      nextIndex = (nextIndex + items.length) % items.length;
      event.preventDefault();
      items[nextIndex]?.focus();
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [itemSelector, ref]);
}
