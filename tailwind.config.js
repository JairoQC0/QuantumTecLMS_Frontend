/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#EC4899",
        accent: "#9333EA",
        dark: "#0F0F11",
        panel: "#1E1E23",
        muted: "#9CA3AF",
        glow1: "#2B1A47",
        glow2: "#0A1A24",
      },
      boxShadow: {
        panel: "0 0 50px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "gradient-cta": "linear-gradient(90deg, #EC4899 0%, #6366F1 100%)",
      },
    },
  },
  plugins: [],
};
