/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0A0A0A",
          surface: "#141414",
          border: "#1A1A1A",
        },
        accent: {
          green: "#00FF87",
          orange: "#FFB800",
          red: "#FF4444",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      spacing: {
        nav: "80px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
}
