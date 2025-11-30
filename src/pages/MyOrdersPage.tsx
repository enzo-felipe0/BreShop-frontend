import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import orderStatusService from '../services/orderStatusService';
import { type Order } from '../types/order.types';

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderStatusService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      alert('Erro ao carregar seus pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.tipoUsuario !== 'COMPRADOR') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
        <Navbar />
        <div className="flex items-center justify-center p-4 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
            <p className="text-breshop-navy mb-4">
              Apenas compradores podem visualizar pedidos.
            </p>
            <Link to="/">
              <Button variant="primary">Voltar para Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-breshop-navy font-display mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status de todos os seus pedidos
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-breshop-navy mb-4"></div>
              <p className="text-breshop-navy text-lg">Carregando pedidos...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-2xl font-bold text-breshop-navy mb-4">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não realizou nenhuma compra
            </p>
            <Link to="/products">
              <Button variant="primary">Ver Produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  {/* Cabeçalho do pedido */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pedido #{order.id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <OrderStatusBadge status={order.status} size="large" />
                    </div>
                  </div>

                  {/* Itens do pedido */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.fotos.length > 0 ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${item.product.fotos[0].url}`}
                              alt={item.product.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              Sem foto
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-breshop-navy line-clamp-1">
                            {item.product.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantidade: {item.quantidade} × R$ {item.preco.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-breshop-navy">
                            R$ {(item.quantidade * item.preco).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{order.items.length - 2} item(ns) adicional(is)
                      </p>
                    )}
                  </div>

                  {/* Rodapé */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total do pedido</p>
                      <p className="text-2xl font-bold text-breshop-navy">
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="primary">Ver Detalhes</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
