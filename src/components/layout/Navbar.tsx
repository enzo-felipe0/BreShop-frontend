import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    alert('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-breshop-navy font-display">
          BreShop
        </Link>
        
        <div className="space-x-4 flex items-center">
          <Link 
            to="/products" 
            className="text-breshop-navy hover:text-breshop-gold transition font-medium"
          >
            Produtos
          </Link>
          
          {isAuthenticated && user ? (
            <>
              {user.tipoUsuario === 'VENDEDOR' && (
                <Link 
                  to="/seller/products/new" 
                  className="text-breshop-navy hover:text-breshop-gold transition font-medium"
                >
                  Cadastrar Produto
                </Link>
              )}

              {user.tipoUsuario === 'COMPRADOR' && (
                <>
                  {/* Botão de Pedidos */}
                  <Link 
                    to="/orders" 
                    className="text-breshop-navy hover:text-breshop-gold transition font-medium"
                  >
                    Meus Pedidos
                  </Link>

                  {/* Ícone do Carrinho */}
                  <Link to="/cart" className="relative p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-breshop-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-breshop-coral rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Dropdown de Perfil */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-breshop-navy hover:text-breshop-gold transition font-medium">
                  <span>{user.nome.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-breshop-navy hover:bg-breshop-beige transition"
                  >
                    👤 Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-breshop-navy hover:bg-breshop-beige transition"
                  >
                    🚪 Sair
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-breshop-navy text-white px-4 py-2 rounded-lg hover:bg-breshop-navy/90 transition"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
