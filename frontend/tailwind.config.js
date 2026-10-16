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
          950: '#081c15',
          900: '#1b4332',
          800: '#2d6a4f',
          700: '#40916c',
          600: '#52b788',
          500: '#74c69d',
          100: '#d8f3dc',
          50: '#edf9f0'
        },
        earth: {
          800: '#6c431d',
          700: '#8c5e34',
          600: '#bc6c25',
          500: '#dda15e',
          100: '#faedcd',
          50: '#fefae0'
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f4ec',
          200: '#ede8da',
          300: '#ded7c1'
        }
      }
    },
  },
  plugins: [],
}
