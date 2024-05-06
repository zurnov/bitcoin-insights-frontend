/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        'max-menu-w': '2400px',
      },
    },
  },
  plugins: [],
};
