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
        brand: {
          purple: "#281B6D",
          darkPurple: "#1E1356",
          green: "#34A853",
          lightBg: "#F8F9FA",
        },
      },
    },
  },
  plugins: [],
};
export default config;