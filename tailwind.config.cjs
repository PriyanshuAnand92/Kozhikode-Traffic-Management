/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f6f8fb',
        panel: '#ffffff',
        ink: '#101828',
        muted: '#667085',
        line: '#d0d5dd',
      },
      boxShadow: {
        soft: '0 12px 36px rgba(15, 23, 42, 0.08)',
        panel: '0 10px 28px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};