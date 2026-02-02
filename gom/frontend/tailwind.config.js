/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "tactical-black": "#0A0A0A",
        "tactical-dark-grey": "#1F1F1F",
        "stainless-steel": "#C0C0C0",
        "caution-yellow": "#FFD700",
        "tech-blue": "#00D4FF",
        "tech-cyan": "#00F0FF",
      },
      fontFamily: {
        "mono": ["'Courier New'", "monospace"],
        "tech": ["'IBM Plex Mono'", "monospace"],
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(0deg, transparent 24%, rgba(255, 215, 0, 0.05) 25%, rgba(255, 215, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 215, 0, 0.05) 75%, rgba(255, 215, 0, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 215, 0, 0.05) 25%, rgba(255, 215, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 215, 0, 0.05) 75%, rgba(255, 215, 0, 0.05) 76%, transparent 77%, transparent)",
        "grid-size": "50px 50px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" },
          "50%": { opacity: "0.8", textShadow: "0 0 20px rgba(255, 215, 0, 0.8)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
}
