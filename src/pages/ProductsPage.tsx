import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import productService from '../services/productService';

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
        <Navbar />
        <div className="flex items-center justify-center p-4 mt-20">
          <p className="text-breshop-navy text-lg">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-breshop-navy mb-8 text-center font-display">
          Produtos em Destaque
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-breshop-navy/70 mb-4">
              Nenhum produto cadastrado ainda
            </p>
            <p className="text-sm text-breshop-navy/50">
              Faça login como vendedor para cadastrar produtos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Imagem do produto */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {product.fotos.length > 0 ? (
                    <img
                      src={`http://localhost:3000${product.fotos[0].url}`}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Informações do produto */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-breshop-navy mb-2">
                    {product.nome}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.descricao}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-breshop-navy">
                      R$ {product.preco.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Estoque: {product.quantidade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Vendedor: {product.vendedor.nome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
