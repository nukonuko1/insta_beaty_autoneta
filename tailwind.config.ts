import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f3d0fe",
          300: "#e9a8fb",
          400: "#d86ef5",
          500: "#c044e8",
          600: "#a326cc",
          700: "#881ea6",
          800: "#701b88",
          900: "#5c1a6f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
