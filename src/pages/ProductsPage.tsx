import React from 'react';
import Navbar from '../components/layout/Navbar';

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

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
