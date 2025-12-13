import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from '../components/layout/Navbar';
import { useCart } from '../contexts/CartContext';
import { type CartItem } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, checkout, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await checkout();
      console.log(response);
      alert('✅ Compra finalizada com sucesso!');
      navigate('/products');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Erro ao finalizar a compra';
      
      if (errorMessage.includes('Estoque insuficiente')) {
        alert(`❌ ${errorMessage}\n\nPor favor, ajuste as quantidades no carrinho.`);
        window.location.reload();
      } else {
        alert(`❌ ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (productId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity < maxStock) {
      updateQuantity(productId, currentQuantity + 1);
    }
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  // Helper para pegar estoque com fallback
  const getStock = (product: any): number => {
    return product.quantidade || 999; // Fallback para estoque alto
  };

  // Helper para pegar descrição com fallback
  const getDescription = (product: any): string => {
    return product.descricao || 'Peça única e exclusiva';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display mb-2">
                Seu Carrinho
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                {cartItems.length === 0 
                  ? 'Nenhum item adicionado ainda'
                  : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'} no carrinho`
                }
              </p>
            </div>
            <div className="hidden sm:block">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex-grow">
        {cartItems.length === 0 ? (
          /* Estado Vazio */
          <div className="max-w-2xl mx-auto text-center py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Explore nossos produtos e encontre peças únicas!
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Itens do Carrinho
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item: CartItem) => {
                    const stock = getStock(item.product);
                    const description = getDescription(item.product);
                    const isLowStock = stock <= 5;

                    return (
                      <div 
                        key={item.product.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        {/* Imagem do Produto */}
                        <div className="w-full sm:w-24 h-48 sm:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          {item.product.fotos[0]?.url ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${item.product.fotos[0].url}`}
                              alt={item.product.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Informações do Produto */}
                        <div className="flex-grow w-full sm:w-auto">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                            {item.product.nome}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-pink-600 font-bold text-lg sm:text-xl">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.preco)}
                            </span>
                            {isLowStock && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                                Apenas {stock} disponíveis
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controles - Responsivo */}
                        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto">
                          {/* Controle de Quantidade Moderno */}
                          <div className="flex items-center gap-1 bg-white rounded-lg border-2 border-gray-300 p-1">
                            <button
                              onClick={() => handleDecrement(item.product.id, item.quantidade)}
                              disabled={item.quantidade <= 1}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                item.quantidade <= 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                              }`}
                              aria-label="Diminuir quantidade"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                              </svg>
                            </button>

                            <div className="w-12 text-center font-bold text-gray-900 text-lg">
                              {item.quantidade}
                            </div>

                            <button
                              onClick={() => handleIncrement(item.product.id, item.quantidade, stock)}
                              disabled={item.quantidade >= stock}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                item.quantidade >= stock
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 active:scale-95'
                              }`}
                              aria-label="Aumentar quantidade"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Botão Remover */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors px-2 py-2 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Remover</span>
                          </button>

                          {/* Subtotal (Desktop) */}
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                            <p className="font-bold text-gray-900 text-lg">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.preco * item.quantidade)}
                            </p>
                          </div>
                        </div>

                        {/* Subtotal (Mobile) */}
                        <div className="sm:hidden w-full pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="font-bold text-gray-900 text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.preco * item.quantidade)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botão Continuar Comprando (Mobile) */}
              <Link
                to="/products"
                className="lg:hidden flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continuar Comprando
              </Link>
            </div>

            {/* Resumo do Pedido - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-md border-2 border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Frete</span>
                    <span className="text-green-600 font-bold">Grátis</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Desconto</span>
                    <span className="text-gray-600">—</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-extrabold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Em até 12x sem juros
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-xl hover:shadow-pink-500/50 hover:-translate-y-1'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Finalizar Compra
                    </>
                  )}
                </button>

                <Link
                  to="/products"
                  className="hidden lg:flex items-center justify-center gap-2 mt-4 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Continuar Comprando
                </Link>

                {/* Badge de Segurança */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Compra 100% Segura
                </div>
              </div>
            </div>
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

export default CartPage;
