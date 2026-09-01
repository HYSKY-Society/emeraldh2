import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Emerald H2 brand system — hydrogen green + hydrogen blue
        brand: {
          50: "#e9f7ef",
          100: "#c9ecd6",
          200: "#98dcb2",
          300: "#5fc88a",
          400: "#2fb069",
          500: "#0b8a4b", // primary
          600: "#087a41",
          700: "#076b3a",
          800: "#0a5531",
          900: "#0b3f26",
        },
        h2blue: {
          400: "#4fb0dd",
          500: "#1877a8",
          600: "#136089",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          muted: "var(--muted)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        ground: "var(--ground)",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "0.9rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,23,18,.04), 0 6px 20px rgba(14,23,18,.05)",
      },
    },
  },
  plugins: [],
};

export default config;
