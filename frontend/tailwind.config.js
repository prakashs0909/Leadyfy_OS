/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbe6',
          100: '#fff1b8',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#ffc069',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        charcoal: {
          950: '#09090B',
          900: '#111111',
          850: '#151518',
          800: '#18181B',
          700: '#27272A',
          600: '#3F3F46',
          500: '#52525B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
