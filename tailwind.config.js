/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#B3B1B1",
        secondary: "#525252",
        third: "#E85656",
        light: {
          100: "#D6C6FF",
          200: "#1E8B5D",
        },
      },
    },
  },
  plugins: [],
};
