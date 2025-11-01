import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService, { type User } from '../services/authService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    alert('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-breshop-navy font-display">
            BreShop
          </h1>
          <div className="space-x-4 flex items-center">
            <Link 
              to="/products" 
              className="text-breshop-navy hover:text-breshop-gold transition"
            >
              Produtos
            </Link>
            
            {user ? (
              <>
                <span className="text-breshop-navy">
                  Olá, {user.nome}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-breshop-coral text-white px-4 py-2 rounded-lg hover:bg-breshop-pink transition"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-breshop-navy text-white px-4 py-2 rounded-lg hover:bg-breshop-navy/90 transition"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="bg-breshop-pink text-white px-4 py-2 rounded-lg hover:bg-breshop-coral transition"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

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
          
          {user && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-breshop-navy mb-4">
                Seu Perfil
              </h3>
              <div className="text-left space-y-2">
                <p><strong>Nome:</strong> {user.nome}</p>
                <p><strong>E-mail:</strong> {user.email}</p>
                <p><strong>Tipo:</strong> {user.tipoUsuario}</p>
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
            {!user && (
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
