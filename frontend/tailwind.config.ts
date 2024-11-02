import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#9d4edd",
        secondary: "#3c096c",
        accent: "#A997DF"
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        opensans: ['var(--font-opensans)']
      }
    },
  },
  plugins: [],
};
export default config;
