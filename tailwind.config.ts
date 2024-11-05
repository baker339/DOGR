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
        primary: "#F53F4D", // Bittersweet
        secondary: "#DD8A2B", // Emerald
        accentLight: "#4CC241", // Light Green
        accentDark: "#12453F", // Jasmine
        highlight: "#FAB32C", // Coral Pink

        white: "#FAFFFE",
        black: "#000000",

        gray: {
          light: "#e0e0e0", // Light gray
          DEFAULT: "#888888", // Medium gray
          dark: "#333333", // Dark gray
        },

        dun: {
          DEFAULT: "#D4C2A6",
          100: "#332919",
          200: "#665231",
          300: "#997a4a",
          400: "#bb9f73",
          500: "#d4c2a6",
          600: "#ddceb7",
          700: "#e5dac9",
          800: "#eee7db",
          900: "#f6f3ed",
        },
        xanthous: {
          DEFAULT: "#FAB32C",
          100: "#3a2601",
          200: "#734c03",
          300: "#ad7204",
          400: "#e79806",
          500: "#fab32c",
          600: "#fbc258",
          700: "#fcd182",
          800: "#fde0ab",
          900: "#fef0d5",
        },
        brunswick_green: {
          DEFAULT: "#12453F",
          100: "#040e0d",
          200: "#071c19",
          300: "#0b2926",
          400: "#0e3732",
          500: "#12453f",
          600: "#23887c",
          700: "#35cbb9",
          800: "#78dcd1",
          900: "#bceee8",
        },
        imperial_red: {
          DEFAULT: "#F53F4D",
          100: "#3a0308",
          200: "#74060f",
          300: "#ae0917",
          400: "#e90c1f",
          500: "#f53f4d",
          600: "#f76470",
          700: "#f98b94",
          800: "#fbb1b8",
          900: "#fdd8db",
        },
        baby_powder: {
          DEFAULT: "#FAFFFE",
          100: "#006551",
          200: "#00caa2",
          300: "#30ffd6",
          400: "#95ffea",
          500: "#fafffe",
          600: "#fbfffe",
          700: "#fcfffe",
          800: "#fdffff",
          900: "#feffff",
        },
        dark_pastel_green: {
          DEFAULT: "#4CC241",
          100: "#0f270d",
          200: "#1e4f19",
          300: "#2d7626",
          400: "#3c9d33",
          500: "#4cc241",
          600: "#71ce68",
          700: "#94da8e",
          800: "#b8e7b4",
          900: "#dbf3d9",
        },
        fulvous: {
          DEFAULT: "#DD8A2B",
          100: "#2e1c07",
          200: "#5b380f",
          300: "#895316",
          400: "#b66f1e",
          500: "#dd8a2b",
          600: "#e4a257",
          700: "#eab981",
          800: "#f1d0ab",
          900: "#f8e8d5",
        },
        pacific_cyan: {
          DEFAULT: "#2CB3D5",
          100: "#08242b",
          200: "#114855",
          300: "#196b80",
          400: "#228faa",
          500: "#2cb3d5",
          600: "#55c2dd",
          700: "#7fd1e6",
          800: "#aae1ee",
          900: "#d4f0f7",
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
