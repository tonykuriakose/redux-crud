/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customeBlue:'#283f57',
        customeGreen:'#403e36',
        customeLightBlue:'#6ecddb',
        customeBlack:'#151c1c'
      }
    },
  },
  plugins: [],
}