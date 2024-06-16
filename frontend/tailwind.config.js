/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      colors: {
        'backgroundcolor': '#1A120B',
        'textcolor': '#EEEEEE',
        'navbarcolor': '#5C3F76',
        'pinkish':  '#F1BDBD',
        'panelbg': '#5d8580',
        'paneloutline': '#41635f'
      },
    
    extend: {},
  },
  plugins: [],
}

