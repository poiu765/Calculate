import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          yellow: "#F2DD6E",
          green: "#CFF27E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
