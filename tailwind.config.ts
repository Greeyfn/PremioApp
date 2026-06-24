import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0f0f0f",
          secondary: "#1a1a1a",
          card: "#1e1a14",
          elevated: "#252525",
        },
        accent: {
          DEFAULT: "#e8d5b0",
          hover: "#f0e0c0",
          dark: "#c4a96a",
        },
        text: {
          primary: "#f5f0e8",
          secondary: "#9a9189",
          muted: "#6b6560",
        },
        border: {
          DEFAULT: "#2a2520",
          light: "#3a3530",
        },
        success: "#4ade80",
        warning: "#fbbf24",
        error: "#f87171",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "Monaco", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
} satisfies Config;
