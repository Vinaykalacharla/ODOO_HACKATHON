/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F4F7FB',
        surface: '#FFFFFF',
        border: '#D9E1EC',
        text: '#0F172A',
        muted: '#64748B',
        accent: '#2563EB',
        teal: '#0F766E',
        danger: '#DC2626',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.08)',
        lift: '0 12px 40px rgba(37, 99, 235, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
