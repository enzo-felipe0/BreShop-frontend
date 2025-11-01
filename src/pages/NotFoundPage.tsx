import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-breshop-navy font-display">404</h1>
        <h2 className="text-3xl font-semibold text-breshop-navy mt-4 mb-8">
          Página não encontrada
        </h2>
        <p className="text-breshop-navy/70 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link 
          to="/" 
          className="bg-breshop-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-breshop-navy/90 transition inline-block"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
