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
        'tooltiptext': '#6A666F',
        'incorrect' : '#EB6969',
        'correct': '#54C75F'
      },
    
    extend: {
      dropShadow: {
      'white': '0 0px 30px #DDDDDD',
      'smallerwhite': '0 0px 30px #978BA1',
      'navbar' : '0 0px 10px #A995BB',
      '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
      ]
      
    },
    fontFamily: {
      'montserrat': ['Montserrat'],
      'playfair': ['Playfair'],
      'quicksand': ['quicksand']
    }},
  },
  plugins: [],
}

