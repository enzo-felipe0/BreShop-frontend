import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    alert('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-breshop-navy font-display">
          BreShop
        </Link>

        <div className="space-x-4 flex items-center">
          <Link
            to="/products"
            className="text-breshop-navy hover:text-breshop-gold transition"
          >
            Produtos
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/products"
                className="text-breshop-navy hover:text-breshop-gold transition"
              >
                Produtos
              </Link>

              {/* Link adicional para vendedores */}
              {user.tipoUsuario === 'VENDEDOR' && (
                <Link
                  to="/seller/products/new"
                  className="text-breshop-navy hover:text-breshop-gold transition"
                >
                  Cadastrar Produto
                </Link>
              )}

              <span className="text-breshop-navy font-semibold">
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
  );
};

export default Navbar;
