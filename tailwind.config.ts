import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#ECECEC",
        olive: "#84934A",
        "olive-dark": "#656D3F",
        maroon: "#492828",
        "warm-white": "#FCF8F8",
        "pink-light": "#FBEFEF",
        "pink-soft": "#F9DFDF",
        "pink-medium": "#F5AFAF",
        brand: {
          50: "#FBEFEF",
          100: "#F9DFDF",
          200: "#F5AFAF",
          300: "#84934A",
          400: "#656D3F",
          500: "#492828",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 1.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-down": "slideDown 0.3s ease-in-out",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 0 rgba(124, 58, 237, 0.4), 0 0 20px rgba(124, 58, 237, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 0 8px rgba(124, 58, 237, 0), 0 0 40px rgba(124, 58, 237, 0.6)",
          },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;