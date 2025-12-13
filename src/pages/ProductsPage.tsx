import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { ProductCard } from '../components/common/ProductCard';
import productService from '../services/productService';
import { useCart } from '../contexts/CartContext'; 
import { useAuth } from '../contexts/AuthContext'; 

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  fotos: ProductImage[];
  vendedor: {
    id: string;
    nome: string;
    email: string;
  };
  createdAt: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, sortBy]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Filtro de busca
    if (searchTerm) {
      result = result.filter(product => 
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    result.sort((a, b) => {
      switch (sortBy) {
        case 'lowest':
          return a.preco - b.preco;
        case 'highest':
          return b.preco - a.preco;
        case 'name':
          return a.nome.localeCompare(b.nome);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredProducts(result);
  };

  const handleAddToCart = (product: Product) => {
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

  const convertToCardProduct = (product: Product) => ({
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

      {/* Header da Página */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">
              Catálogo Completo
            </h1>
            <p className="text-xl text-gray-300">
              Explore nossa coleção de peças únicas garimpadas com carinho
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Barra de Filtros e Busca */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo de Busca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar produtos
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none text-gray-900"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none text-gray-900 cursor-pointer"
              >
                <option value="newest">Mais recentes</option>
                <option value="lowest">Menor preço</option>
                <option value="highest">Maior preço</option>
                <option value="name">Nome (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Contador de Resultados */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-bold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              {searchTerm && <span className="text-pink-600"> para "{searchTerm}"</span>}
            </p>
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar busca
              </button>
            )}
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={convertToCardProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
                showCartButton={true}
                disabled={!canAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Nenhum produto encontrado</h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `Não encontramos produtos para "${searchTerm}". Tente uma busca diferente.`
                : 'Nenhum produto disponível no momento.'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('newest');
              }}
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} BreShop. Consumo consciente, futuro sustentável.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
