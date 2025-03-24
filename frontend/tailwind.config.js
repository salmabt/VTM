/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Analyse tous les fichiers JS/JSX/TS/TSX dans le dossier src
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#A2D5F2', // Bleu pastel
          pink: '#FFB6C1', // Rose pastel
          green: '#77DD77', // Vert pastel plus vif
          yellow: '#FFFACD', // Jaune pastel
          purple: '#D8BFD8', // Violet pastel
          orange: '#FFDAB9', // Orange pastel
          gray: '#F0F0F0', // Gris pastel
          turquoise: '#B2F2E6', // Bleu turquoise plus clair
          mauve: '#E6E6FA', // Mauve pastel
        },
      },
      boxShadow: {
        'md': '0 2px 8px rgba(0, 0, 0, 0.1)', // Ombre douce pour les cartes et les modaux
        'lg': '0 4px 12px rgba(0, 0, 0, 0.15)', // Ombre plus prononcée si nécessaire
      },
      borderRadius: {
        'lg': '8px', // Bordures arrondies pour les cartes et les boutons
        'md': '4px', // Bordures arrondies pour les tags et les événements
      },
    },
  },
  plugins: [],
};