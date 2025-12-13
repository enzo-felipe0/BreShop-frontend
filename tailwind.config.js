/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta personalizada para o BreShop
        breshop: {
          navy: '#1a237e',   // Azul marinho profundo (fundo do Hero)
          pink: '#ec407a',   // Rosa vibrante para destaques/botões
          coral: '#ff7043',  // Coral para preços/ofertas
          light: '#f8f9fa',  // Fundo claro
          dark: '#121212',   // Texto escuro
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'], // Sugestão: adicione uma fonte de destaque se puder
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
