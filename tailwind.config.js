/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pine: "#1F3D2B", // hero background, primary text-on-cream
        mustard: "#D9A441", // primary accent, CTA fill, seal ticks
        cream: "#FBF3E7", // sheet background, text-on-pine
        clay: "#B5533C", // secondary accent, links
        ink: "#2A2620", // muted body text on cream
        fog: {
          50: "#F5F3EF",
          100: "#EBE8E2",
          200: "#E5E1D8",
          300: "#C9C6C0",
        },
      },
    },
  },
  plugins: [],
};
