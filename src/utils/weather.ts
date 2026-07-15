export function cToDisplay(celsius: number, unit: "c" | "f") {
  if (unit === "f") return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  return `${celsius.toFixed(1)}°C`;
}
