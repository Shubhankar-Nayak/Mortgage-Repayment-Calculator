/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        Lime: "hsl(61, 70%, 52%)",
        Red: "hsl(4, 69%, 50%)",
        White: "hsl(0, 0%, 100%)",
        Slate100: "hsl(202, 86%, 94%)",
        Slate300: "hsl(203, 41%, 72%)",
        Slate500: "hsl(200, 26%, 54%)",
        Slate700: "hsl(200, 24%, 40%)",
        Slate900: "hsl(202, 55%, 16%)"
      },
      fontFamily: {
        PlusJarkartaSans: ["PlusJarkartaSans"]
      },
      screens: {
        "tablet" : "576px",
        "laptop" : "768px"
      }
    },
  },
  plugins: [],
}

