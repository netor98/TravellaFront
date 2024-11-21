/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': {backgroundPosition: '-200px 0'},
          '100%': {backgroundPosition: '200px 0'},
        },
      },
    },
  },
  plugins: [],
}

