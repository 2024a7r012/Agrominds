/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        forest: {
          950: '#061710',
          900: '#0f291e',
          850: '#15392b',
          800: '#1d4737',
          700: '#265c47',
          600: '#347a5f',
          500: '#469d7b',
          400: '#62bf99',
          300: '#8ee0be',
          200: '#bcf2dc',
          100: '#ddfaed',
          50: '#f0fdf7'
        },
        earth: {
          900: '#4a2810',
          800: '#6c3b17',
          700: '#8c4e20',
          600: '#b0652d',
          500: '#cb7e3e',
          400: '#dda267',
          300: '#ecc697',
          200: '#f5e2ca',
          100: '#faedd9',
          50: '#fdf8f0'
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f4ec',
          200: '#ede8da',
          300: '#ded7c1'
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 35px -5px rgba(52, 211, 153, 0.25)',
        'glow-forest': '0 0 45px -10px rgba(15, 41, 30, 0.4)',
        'glass': '0 8px 32px 0 rgba(15, 41, 30, 0.08)'
      }
    },
  },
  plugins: [],
}
