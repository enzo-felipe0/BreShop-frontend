import React from 'react';
import { Link } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <h1 className="text-3xl font-bold text-breshop-navy font-display">
              BreShop
            </h1>
          </Link>
          <div className="space-x-4">
            <Link 
              to="/" 
              className="text-breshop-navy hover:text-breshop-gold transition"
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className="bg-breshop-navy text-white px-4 py-2 rounded-lg hover:bg-breshop-navy/90 transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-breshop-navy mb-8 text-center font-display">
          Produtos em Destaque
        </h2>
        
        <div className="text-center text-breshop-navy/70 py-20">
          <p className="text-xl">Em breve: catálogo completo de produtos!</p>
          <p className="text-sm mt-4">Esta página será desenvolvida nos próximos passos.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
