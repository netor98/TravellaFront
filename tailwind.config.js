/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
        blink: 'blink 0.7s steps(1) infinite',
        'slide-in-from-top': 'slideInFromTop 0.7s ease-out',
      },
      keyframes: {
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': {backgroundPosition: '-200px 0'},
          '100%': {backgroundPosition: '200px 0'},
        },
        blink: {
          '50%': {opacity: 'transparent'},
        }
      },
    },
  },
  plugins: [],
}

