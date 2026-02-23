/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
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
        'surface-dark': '#131022',
        'bg-dark': '#0a0a0e',
        dubai: {
          dark: '#0a0a0e',
          navy: '#131022',
          blue: '#0f3460',
          accent: '#e94560',
        }
      },
      fontFamily: {
        sans: ['Spline Sans', 'system-ui', 'sans-serif'],
        display: ['Spline Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
