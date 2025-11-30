import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-breshop-navy mb-4"></div>
                        <p className="text-breshop-navy text-lg">Carregando detalhes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Cabeçalho */}
                <div className="mb-6">
                    <Link to="/orders" className="text-breshop-navy hover:text-breshop-gold mb-4 inline-flex items-center gap-2">
                        ← Voltar para Meus Pedidos
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-breshop-navy font-display">
                                Pedido #{order.id.substring(0, 8).toUpperCase()}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <OrderStatusBadge status={order.status} size="large" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline de status */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-breshop-navy mb-4">
                                Acompanhamento do Pedido
                            </h2>
                            <OrderTimeline
                                currentStatus={order.status}
                                statusUpdatedAt={order.statusUpdatedAt}
                                estimatedNextUpdate={order.estimatedNextUpdate}
                            />
                        </div>

                        {/* Itens do pedido */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-breshop-navy mb-4">
                                Itens do Pedido
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                                            <h3 className="font-bold text-breshop-navy">{item.product.nome}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.product.descricao}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Vendedor: {item.product.vendedor.nome}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                {item.quantidade}x R$ {item.preco.toFixed(2)}
                                            </p>
                                            <p className="font-bold text-breshop-navy">
                                                R$ {(item.quantidade * item.preco).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Resumo do pedido */}
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-breshop-navy mb-4">
                                Resumo do Pedido
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>R$ {order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Frete</span>
                                    <span className="text-green-600 font-semibold">Grátis</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span className="text-breshop-navy">Total</span>
                                    <span className="text-breshop-navy">R$ {order.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Botão de teste (apenas em dev) */}
                            {isDevelopment && order.status !== 'ENTREGUE' && order.status !== 'CANCELADO' && (
                                <div className="mt-6 pt-6 border-t">
                                    <Button
                                        onClick={handleForceUpdate}
                                        variant="secondary"
                                        fullWidth
                                    >
                                        🔧 Forçar Atualização (Teste)
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Apenas disponível em desenvolvimento
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
