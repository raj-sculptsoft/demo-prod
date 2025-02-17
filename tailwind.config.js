/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        bodyBackground: "#F2F4F8",
        borderColor: {
          DEFAULT: "#D9D9D9",
          dark: "#697077",
        },
        primary: {
          light: "#E5D9F8",
          DEFAULT: "#814AE0",
        },
        secondary: {
          DEFAULT: "#121619",
        },
        yellow: {
          light: "#FFF3D6",
          DEFAULT: "#FEC53D",
        },
        green: {
          lighter: "#D9F7E8",
          light: "#4AD991",
          DEFAULT: "#07AF23",
          chart: "#31D080",
        },
        orange: {
          lighter: "#FFF2F3",
          light: "#FFE8DF",
          DEFAULT: "#FF9066",
          chart: "#FB9199",
          impactDark: "#FFA500",
          impactLight: "#FEEED9",
        },
        red: {
          lighter: "#FFF2F3",
          light: "#FB9199",
          DEFAULT: "#D04D6C",
          impactLight: "#FCE2E0",
        },
        blue: { DEFAULT: "#5E77FF" },
        boxShadow: {
          custom:
            "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
