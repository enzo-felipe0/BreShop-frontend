import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
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
      alert('✅ Compra finalizada com sucesso!');
      
      // Redirecionar para página de produtos (o estoque será recarregado automaticamente)
      navigate('/products');
      
    } catch (error: any) {
      console.error(error);
      
      // Tratar erro de estoque insuficiente especificamente
      const errorMessage = error.response?.data?.error || 'Erro ao finalizar a compra';
      
      if (errorMessage.includes('Estoque insuficiente')) {
        alert(`❌ ${errorMessage}\n\nPor favor, ajuste as quantidades no carrinho.`);
        // Opcional: recarregar produtos para mostrar estoque atualizado
        window.location.reload();
      } else {
        alert(`❌ ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-breshop-navy font-display">
          Seu Carrinho
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl text-breshop-navy mb-4">Seu carrinho está vazio</h2>
            <Link to="/products">
              <Button variant="primary">Ver produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itens do carrinho */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg space-y-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.product.id} className="flex items-center border-b pb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${item.product.fotos[0]?.url}`}
                    alt={item.product.nome}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-breshop-navy">{item.product.nome}</h3>
                    <p className="text-sm text-gray-600">R$ {item.product.preco.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                      className="w-16 text-center border rounded-md mx-4"
                      min="1"
                    />
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
              <h2 className="text-xl font-bold text-breshop-navy mb-4">Resumo do Pedido</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} variant="primary" fullWidth disabled={loading}>
                {loading ? 'Finalizando...' : 'Finalizar Compra'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
