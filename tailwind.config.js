/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        BWhite: "#221510",
        TextColor: "#2b1e18",
        BtnColor: "#4b423d",
        foreground: "var(--foreground)",
        beige: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(20%)' }, // Start off-screen right
          '100%': { transform: 'translateX(-80%)' }, // End off-screen left
        },
        // Include slideDownFadeIn if used elsewhere
        slideDownFadeIn: {
          'from': { opacity: '0', transform: 'translateY(-100%)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        // Adjust duration (e.g., 20s) as needed for speed
        marquee: 'scroll-left 100s linear infinite',
        // Keep the slide down animation if needed
        slideDownFadeIn: 'slideDownFadeIn 0.7s ease-out forwards',
      }
    },
  },
  plugins: [],
};