/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
      },
      flex: {
        4: "4 4 0%",
        6: "6 6 0%",
        3: "3 3 0%",
        7: "7 7 0%",
        5: "5 5 0%",
      },
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements-react/dist/plugin.cjs")],
};
