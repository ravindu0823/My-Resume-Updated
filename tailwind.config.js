/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        primaryBlue: "#1d4ed8",
        grey: {
          800: "#18141c",
          900: "#120f16",
        },
        yellow: {
          400: "#FEDE00",
        },
        primary: {
          100: "#180161",
          200: "#4D55CC",
          300: "#7A73D1",
          400: "#B5A8D5",
        },
      },
      backgroundImage: {
        heropattern: "url(/herobgc.jpg)",
      },
    },
    plugins: [],
  },
};
