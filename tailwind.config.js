/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
     /* fontSize: {
        base: '1.5rem', // Aumenta el tamaño base
        lg: '1.8rem',   // Aumenta el tamaño grande
        xl: '2.3rem',     // Tamaño extra grande
      },
      spacing: {
        sm: '12px',    // Espaciado pequeño
        md: '20px',    // Espaciado mediano
        lg: '32px',    // Espaciado grande
      },*/
      animation: {
        shimmer: 'shimmer 2s infinite',
        blink: 'blink 0.7s steps(1) infinite',
      },
      keyframes: {
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

