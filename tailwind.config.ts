import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        heading: ["var(--font-heading)", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        surface: {
          50: "#f8fafc",
          100: "#eef2f8",
          200: "#e2e8f0",
          300: "#cbd5e1",
          900: "#0b1224"
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          400: "#22d3ee",
          500: "#0ea5e9",
          600: "#0284c7"
        }
      },
      boxShadow: {
        glass: "0 20px 60px rgba(15, 23, 42, 0.18)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.04)",
        card: "0 12px 40px rgba(14, 165, 233, 0.18)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.18), transparent 24%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.15), transparent 24%), radial-gradient(circle at 50% 80%, rgba(74,222,128,0.12), transparent 22%)",
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)"
      }
    }
  },
  plugins: [animate]
};

export default config;
