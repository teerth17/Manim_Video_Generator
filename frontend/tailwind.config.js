/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d1e3fe',
          200: '#b3d4fc',
          300: '#96c2fa',
          400: '#7ab9f8',
          500: '#5ea9f5',
          600: '#4d95e6',
          700: '#3b80d6',
          800: '#2a6bc6',
          900: '#1a56b5',
          950: '#0d3791',
        },
        bg: {
          primary: '#1a1a2e',
          secondary: '#2d3436',
          tertiary: '#34495e',
        },
        accent: {
          cyan: '#00b894',
          purple: '#6c5ce7',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
