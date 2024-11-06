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
        primary: "#F53F4D", // Imperial Red
        secondary: "#2CB3D5", // Pacific Cyan
        accentLight: "#FAB32C", // Xanthous
        accentDark: "#12453F", // Brunswick Green
        highlight: "#4CC241", // Fulvous

        background: "#FAFFFE", // Baby Powder (app background)
        success: "#4CC241", // Dark Pastel Green
        neutral: "#D4C2A6", // Dun (for softer, neutral UI elements)

        black: "#000000",
        white: "#FFFFFF",

        gray: {
          light: "#e0e0e0",
          DEFAULT: "#888888",
          dark: "#333333",
        },
      },
      backgroundImage: {
        "gradient-top":
          "linear-gradient(0deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-right":
          "linear-gradient(90deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-bottom":
          "linear-gradient(180deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-left":
          "linear-gradient(270deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-top-right":
          "linear-gradient(45deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-bottom-right":
          "linear-gradient(135deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-top-left":
          "linear-gradient(225deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-bottom-left":
          "linear-gradient(315deg, #F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
        "gradient-radial":
          "radial-gradient(#F53F4D, #2CB3D5, #FAB32C, #12453F, #DD8A2B)",
      },
    },
  },
  plugins: [],
};

export default config;
