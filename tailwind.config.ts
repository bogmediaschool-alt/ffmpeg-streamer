import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cockpit: {
          950: "#07111d",
          900: "#0b1724",
          800: "#112235",
          700: "#173754",
        },
        electric: {
          500: "#0a84ff",
          400: "#17c8ff",
          300: "#54f0ff",
        },
      },
      boxShadow: {
        glow: "0 0 28px rgba(23, 200, 255, 0.28)",
        panel: "0 24px 60px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
