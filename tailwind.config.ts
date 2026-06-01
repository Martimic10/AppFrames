import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f8fafc"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.12), 0 8px 40px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
