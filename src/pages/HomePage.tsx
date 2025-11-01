import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-breshop-navy mb-4 font-display">
            Bem-vindo ao BreShop
          </h2>
          <p className="text-xl text-breshop-navy/70 mb-8">
            +Um consumo consciente, sustentável & único
          </p>
          <p className="text-lg text-breshop-navy/60 mb-12">
            A plataforma de e-commerce voltada para brechós online. 
            Compre e venda produtos de segunda mão de forma prática e segura.
          </p>
          
          {isAuthenticated && user && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-breshop-navy mb-4">
                Seu Perfil
              </h3>
              <div className="text-left space-y-2">
                <p><strong>Nome:</strong> {user.nome}</p>
                <p><strong>E-mail:</strong> {user.email}</p>
                <p><strong>Tipo:</strong> {user.tipoUsuario === 'COMPRADOR' ? 'Comprador' : 'Vendedor'}</p>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-breshop-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-breshop-navy/90 transition"
            >
              Ver Produtos
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="bg-breshop-pink text-white px-8 py-3 rounded-lg font-semibold hover:bg-breshop-coral transition"
              >
                Começar a Vender
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
