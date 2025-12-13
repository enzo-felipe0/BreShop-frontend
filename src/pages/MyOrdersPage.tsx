import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import { useAuth } from '../contexts/AuthContext';
import orderStatusService from '../services/orderStatusService';
import { type Order } from '../types/order.types';

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [orders, statusFilter, sortBy]);

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

  const applyFiltersAndSort = () => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.total - a.total;
        case 'lowest':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredOrders(result);
  };

  const calculateTotalSpent = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDENTE').length,
      completed: orders.filter(o => o.status === 'ENTREGUE').length,
      cancelled: orders.filter(o => o.status === 'CANCELADO').length,
    };
  };

  if (!user || user.tipoUsuario !== 'COMPRADOR') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-grow p-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border-2 border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-6 text-base sm:text-lg">
              Apenas compradores podem visualizar pedidos.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm sm:text-base"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header com Estatísticas - Responsivo */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display mb-2 sm:mb-3">
              Meus Pedidos
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Acompanhe o histórico e status de todas as suas compras
            </p>
          </div>

          {/* Cards de Estatísticas - Grid Responsivo */}
          {orders.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Total de Pedidos</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Em Andamento</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Concluídos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 col-span-2 lg:col-span-1">
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Total Gasto</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotalSpent())}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
            <p className="text-gray-600 font-medium text-base sm:text-lg">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 mx-4 sm:mx-0">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 px-4">
              Nenhum pedido encontrado
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 px-4">
              Você ainda não realizou nenhuma compra
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <>
            {/* Barra de Filtros - Responsiva */}
            <div className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Filtro por Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Filtrar por status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none text-gray-900 cursor-pointer"
                  >
                    <option value="all">Todos os status</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="PROCESSANDO">Processando</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGUE">Entregue</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>

                {/* Ordenação */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none text-gray-900 cursor-pointer"
                  >
                    <option value="newest">Mais recentes</option>
                    <option value="oldest">Mais antigos</option>
                    <option value="highest">Maior valor</option>
                    <option value="lowest">Menor valor</option>
                  </select>
                </div>
              </div>

              {/* Contador de Resultados */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-bold text-gray-900">{filteredOrders.length}</span> {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                </p>
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-xs sm:text-sm text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar filtro
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Pedidos - Responsiva */}
            <div className="space-y-4 sm:space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-pink-200"
                >
                  {/* Cabeçalho do Pedido */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b-2 border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                            Pedido #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="sm:hidden">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="self-start sm:self-auto">
                        <OrderStatusBadge status={order.status} size="large" />
                      </div>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                            {item.product.fotos.length > 0 ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${item.product.fotos[0].url}`}
                                alt={item.product.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
                              {item.product.nome}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Qtd: <span className="font-semibold">{item.quantidade}</span> × {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-600 mb-1 hidden sm:block">Subtotal</p>
                            <p className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.preco)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-center py-2 text-gray-600 text-xs sm:text-sm font-medium bg-gray-50 rounded-lg">
                          +{order.items.length - 3} item(ns) adicional(is)
                        </div>
                      )}
                    </div>

                    {/* Rodapé com Total e Ações */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-200">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total do pedido</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                        </p>
                      </div>
                      <Link 
                        to={`/orders/${order.id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Ver Detalhes Completos</span>
                        <span className="sm:hidden">Ver Detalhes</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 sm:py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              &copy; {new Date().getFullYear()} BreShop. Consumo consciente, futuro sustentável.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyOrdersPage;
