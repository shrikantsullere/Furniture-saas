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
          DEFAULT: '#6DC3BB', // Teal/Turquoise
          dark: '#5aafa5',
          light: '#7dd4cc',
        },
        secondary: {
          DEFAULT: '#ffffff', // White
          dark: '#f5f5f5',
          light: '#ffffff',
        },
        background: {
          DEFAULT: '#ffffff', // White
          light: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

