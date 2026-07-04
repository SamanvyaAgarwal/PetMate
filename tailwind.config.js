/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
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
      },
    },
  },
  plugins: [],
};
