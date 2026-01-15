/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc7c7',
          300: '#ffa3a3',
          400: '#ff7a7a',
          500: '#f25c54',
          600: '#e04840',
          700: '#bc3a33',
          800: '#9b332d',
          900: '#81302b',
        }
      }
    },
  },
  plugins: [],
}
