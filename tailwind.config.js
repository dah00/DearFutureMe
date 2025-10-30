const { colors } = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        // Default sans family used by NativeWind base styles
        sans: ["InstrumentSans"],
        instrument: ["InstrumentSans"],
        "instrument-italic": ["InstrumentSans-Italic"],
      },
    },
  },
  plugins: [],
};
