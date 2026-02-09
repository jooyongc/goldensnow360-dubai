/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#faefc5',
          200: '#f5df8e',
          300: '#f0cf57',
          400: '#e8bc2a',
          500: '#c9a01e',
          600: '#9d7b16',
          700: '#715912',
          800: '#4a3a0d',
          900: '#2d2308',
        },
        dubai: {
          dark: '#1a1a2e',
          navy: '#16213e',
          blue: '#0f3460',
          accent: '#e94560',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
