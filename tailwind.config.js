/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: "#45f882",
        heading_dark: "#198754",
        dark: "#121a23",
        dark_light: "#24282E",
        dark_light_2: "#35383D",
      },
      keyframes: {
        shake: {
          "10%": { transform: "translateX(5px)" },
          "20%": { transform: "translateX(-5px)" },
          "30%": { transform: "translateX(3px)" },
          "40%": { transform: "translateX(-3px)" },
          "50%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-2px)" },
          "70%": { transform: "translateX(1px)" },
          "80%": { transform: "translateX(-1px)" },
          "90%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(0px)" },
        },
      },
      animation: {
        shake: "shake 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
