import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
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
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

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

  // ... (resto do código)

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-breshop-navy mb-8 text-center font-display">
          Produtos em Destaque
        </h2>

        {/* ... (código de loading/vazio) */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {/* Badge de estoque */}
                  {product.quantidade === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ESGOTADO
                    </div>
                  )}
                  {product.quantidade > 0 && product.quantidade <= 5 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ÚLTIMAS {product.quantidade}
                    </div>
                  )}
                  
                  {product.fotos.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${product.fotos[0].url}`}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-breshop-navy mb-2 truncate">
                    {product.nome}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.descricao}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-breshop-navy">
                      R$ {product.preco.toFixed(2)}
                    </span>
                    <span className={`text-xs ${product.quantidade === 0 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                      {product.quantidade === 0 ? 'Sem estoque' : `Estoque: ${product.quantidade}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Adicionar ao Carrinho */}
              <div className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  variant="primary"
                  fullWidth
                  disabled={product.quantidade === 0 || (user?.tipoUsuario === 'VENDEDOR')}
                >
                  {product.quantidade === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;