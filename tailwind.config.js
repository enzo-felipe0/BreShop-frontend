/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'breshop-beige': '#F5E6D3',
        'breshop-pink': '#E8A5A0',
        'breshop-navy': '#2C3E50',
        'breshop-gold': '#B8A76B',
        'breshop-coral': '#D89B94',
      },
    },
  },
  plugins: [],
}
