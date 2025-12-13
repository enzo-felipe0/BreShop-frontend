import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import OrderTimeline from '../components/order/OrderTimeline';
import { useAuth } from '../contexts/AuthContext';
import orderStatusService from '../services/orderStatusService';
import { type Order } from '../types/order.types';

const OrderDetailsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            loadOrder(orderId);
        }
    }, [orderId]);

    const loadOrder = async (id: string) => {
        try {
            const response = await orderStatusService.getOrderById(id);
            setOrder(response.data);
        } catch (error: any) {
            console.error('Erro ao carregar pedido:', error);
            if (error.response?.status === 404) {
                alert('Pedido não encontrado');
            } else if (error.response?.status === 403) {
                alert('Você não tem permissão para ver este pedido');
            } else {
                alert('Erro ao carregar detalhes do pedido');
            }
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleForceUpdate = async () => {
        if (!orderId) return;

        if (!window.confirm('Deseja forçar a atualização do status? (Apenas para testes)')) {
            return;
        }

        try {
            await orderStatusService.forceUpdateStatus(orderId);
            alert('Status atualizado com sucesso!');
            loadOrder(orderId);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao atualizar status');
        }
    };

    const isDevelopment = import.meta.env.MODE === 'development';

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

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex flex-col justify-center items-center flex-grow">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
                    <p className="text-gray-600 font-medium text-base sm:text-lg">Carregando detalhes do pedido...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Header com Breadcrumb - Responsivo */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 sm:py-8">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <Link 
                        to="/orders" 
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4 group text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar para Meus Pedidos
                    </Link>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display mb-2">
                                Pedido #{order.id.substring(0, 8).toUpperCase()}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-300 flex items-center gap-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="hidden sm:inline">
                                    Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
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
                        <div className="self-start sm:self-auto">
                            <OrderStatusBadge status={order.status} size="large" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Timeline de Status */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                    Acompanhamento do Pedido
                                </h2>
                            </div>
                            <OrderTimeline
                                currentStatus={order.status}
                                statusUpdatedAt={order.statusUpdatedAt}
                                estimatedNextUpdate={order.estimatedNextUpdate}
                            />
                        </div>

                        {/* Itens do Pedido */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-100 p-4 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                        Produtos Comprados
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} no pedido
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 sm:space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                    >
                                        <div className="w-full sm:w-20 h-48 sm:h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                                            {item.product.fotos.length > 0 ? (
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
                                        
                                        <div className="flex-grow w-full sm:w-auto">
                                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                                                {item.product.nome}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                                                {item.product.descricao}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                <span className="bg-white px-2 sm:px-3 py-1 rounded-lg border border-gray-300 font-medium text-gray-700">
                                                    Vendedor: {item.product.vendedor.nome}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full sm:w-auto flex justify-between sm:block text-left sm:text-right flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                                            <div className="sm:hidden">
                                                <p className="text-xs text-gray-600">Quantidade</p>
                                                <p className="text-sm font-semibold text-gray-900">{item.quantidade}x</p>
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                    <span className="hidden sm:inline">{item.quantidade}x </span>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)}
                                                </p>
                                                <p className="text-lg sm:text-xl font-bold text-gray-900">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.preco)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Resumo */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl shadow-md border-2 border-gray-200 p-4 sm:p-6 lg:sticky lg:top-4">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                    Resumo do Pedido
                                </h2>
                            </div>

                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                {/* Informações do Pedido */}
                                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Número do Pedido</p>
                                    <p className="font-mono font-bold text-gray-900 text-sm sm:text-base">
                                        #{order.id.substring(0, 8).toUpperCase()}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Data do Pedido</p>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {order.estimatedNextUpdate && (
                                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                                        <p className="text-[10px] sm:text-xs text-blue-600 mb-1 font-semibold">Próxima Atualização</p>
                                        <p className="font-semibold text-blue-900 text-sm sm:text-base">
                                            {new Date(order.estimatedNextUpdate).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Valores */}
                            <div className="space-y-2 sm:space-y-3 py-3 sm:py-4 border-y-2 border-gray-300">
                                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                    <span className="font-medium">Frete</span>
                                    <span className="text-green-600 font-bold">Grátis</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center py-3 sm:py-4">
                                <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                </span>
                            </div>

                            {/* Botão de Teste (Dev) */}
                            {isDevelopment && order.status !== 'ENTREGUE' && order.status !== 'CANCELADO' && (
                                <div className="mt-3 sm:mt-4">
                                    <button
                                        onClick={handleForceUpdate}
                                        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-yellow-600 transition-all"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Forçar Atualização (DEV)</span>
                                        <span className="sm:hidden">Atualizar (DEV)</span>
                                    </button>
                                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2">
                                        Apenas disponível em desenvolvimento
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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

export default OrderDetailsPage;