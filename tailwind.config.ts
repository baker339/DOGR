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
        primary: "#ee6055ff", // Bittersweet
        secondary: "#60d394ff", // Emerald
        accentLight: "#aaf683ff", // Light Green
        accentDark: "#ffd97dff", // Jasmine
        highlight: "#ff9b85ff", // Coral Pink

        white: "#ffffff",
        black: "#000000",

        gray: {
          light: "#e0e0e0", // Light gray
          DEFAULT: "#888888", // Medium gray
          dark: "#333333", // Dark gray
        },
      },
      backgroundImage: {
        "gradient-top":
          "linear-gradient(0deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-right":
          "linear-gradient(90deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-bottom":
          "linear-gradient(180deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-left":
          "linear-gradient(270deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-top-right":
          "linear-gradient(45deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-bottom-right":
          "linear-gradient(135deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-top-left":
          "linear-gradient(225deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-bottom-left":
          "linear-gradient(315deg, #ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
        "gradient-radial":
          "radial-gradient(#ee6055ff, #60d394ff, #aaf683ff, #ffd97dff, #ff9b85ff)",
      },
    },
  },
  plugins: [],
};
export default config;
