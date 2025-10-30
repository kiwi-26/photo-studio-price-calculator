/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#df306b',
          hover: '#c6286b',
        },
        success: '#42b983',
        danger: '#f44336',
        'danger-hover': '#d32f2f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'media', // Use system preference for dark mode
}