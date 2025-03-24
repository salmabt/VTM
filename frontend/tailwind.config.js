/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'task-planned': '#cce5ff',
        'task-inprogress': '#d4edda',
        'task-completed': '#f8d7da',
        'primary': '#3b82f6',
        'secondary': '#60a5fa'
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(0,0,0,0.05)',
        'task': '0 2px 8px rgba(0,0,0,0.08)'
      },
      spacing: {
        '128': '32rem'
      },
      animation: {
        'modalEnter': 'modalEnter 0.3s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
   
  ],
};
