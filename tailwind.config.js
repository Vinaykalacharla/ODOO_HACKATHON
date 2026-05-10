/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        surface: '#FFFFFF',
        border: '#E8E2D9',
        text: '#1C1C1E',
        muted: '#6B6560',
        accent: '#E8A020',
        teal: '#2A9D8F',
        danger: '#E63946',
        warning: '#F4A261',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
