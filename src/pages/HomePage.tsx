import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ProductCard } from '../components/common/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Interface para o produto vindo da API
interface ApiProduct {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  fotos: Array<{
    id: string;
    url: string;
  }>;
  vendedor: {
    id: string;
    nome: string;
    email: string;
  };
}

// Interface para o ProductCard
interface CardProduct {
  id: number | string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  quantidade?: number;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const data: ApiProduct[] = Array.isArray(response.data) ? response.data : [];
        setFeaturedProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para adicionar ao carrinho
  const handleAddToCart = (product: ApiProduct) => {
    if (!user) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }
    if (user.tipoUsuario !== 'COMPRADOR') {
      alert('Apenas compradores podem adicionar produtos ao carrinho.');
      return;
    }
    if (product.quantidade === 0) {
      alert('Produto sem estoque disponível.');
      return;
    }
    
    addToCart(product, 1);
    alert(`${product.nome} adicionado ao carrinho!`);
  };

  // Converte para o formato do ProductCard
  const convertToCardProduct = (product: ApiProduct): CardProduct => ({
    id: product.id,
    nome: product.nome,
    descricao: product.descricao,
    preco: product.preco,
    quantidade: product.quantidade,
    imagemUrl: product.fotos.length > 0 
      ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.fotos[0].url}` 
      : undefined
  });

  const canAddToCart = user?.tipoUsuario === 'COMPRADOR';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section - Alto Contraste e Foco Visual */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-24 md:py-32 overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge de destaque */}
            <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-pink-300">Moda Consciente & Sustentável</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display mb-4 sm:mb-6 leading-tight px-2">
              Seu estilo,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500">
                nossa missão
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Descubra peças únicas de segunda mão garimpadas com carinho. 
              Estilo autêntico com impacto positivo no planeta.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link 
                to="/products" 
                className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar Produtos
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                to="/register" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300"
              >
                Quero Vender
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Benefícios - Alto Contraste */}
      <div className="bg-gray-900 border-y border-gray-800 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white py-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold text-sm sm:text-base">Preços Justos</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white py-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold text-sm sm:text-base">Entrega Segura</span>
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-white py-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              <span className="font-semibold text-sm sm:text-base">Sustentável</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Produtos - Fundo Branco com Contraste */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex-grow">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 font-display mb-2">
              Recém Chegados
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Peças garimpadas com carinho, prontas para fazer parte do seu guarda-roupa
            </p>
          </div>
          
          <Link 
            to="/products" 
            className="hidden lg:flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700 transition-colors group whitespace-nowrap"
          >
            Ver todos os produtos
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 sm:h-96 bg-gray-50 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Carregando produtos...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <>
            {/* Grid Responsivo de Produtos */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={convertToCardProduct(product)}
                  showCartButton={true}
                  onAddToCart={() => handleAddToCart(product)}
                  disabled={!canAddToCart}
                />
              ))}
            </div>

            {/* CTA para ver mais - Visível em todos os tamanhos */}
            <div className="mt-12 text-center">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg w-full sm:w-auto max-w-md mx-auto sm:max-w-none"
              >
                Ver Catálogo Completo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 px-4">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Nenhum produto disponível</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Estamos preparando novidades incríveis para você!
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors text-sm sm:text-base"
            >
              Seja o primeiro a vender
            </Link>
          </div>
        )}
      </main>

      {/* Footer - Responsivo */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 sm:py-12 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4 font-display">BreShop</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Transformando moda em movimento circular. 
                Consumo consciente, estilo autêntico.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-pink-400 transition-colors text-sm sm:text-base">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-pink-400 transition-colors text-sm sm:text-base">
                    Vender
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-pink-400 transition-colors text-sm sm:text-base">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contato</h4>
              <p className="text-gray-400 text-sm sm:text-base">contato@breshop.com.br</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} BreShop. Consumo consciente, futuro sustentável.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
