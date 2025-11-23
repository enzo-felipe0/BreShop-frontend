import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import orderService from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const SalesHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await orderService.getMySales();
        setSales(res.data);
      } catch {
        alert('Erro ao carregar histórico de vendas');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (!user || user.tipoUsuario !== 'VENDEDOR') {
    return (
      <div>
        <Navbar />
        <div className="text-center p-10">Acesso permitido apenas para vendedores.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-breshop-beige via-breshop-pink/20 to-breshop-beige">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-breshop-navy">Minhas Vendas</h1>
        {loading ? (
          <div>Carregando...</div>
        ) : sales.length === 0 ? (
          <div>Você ainda não realizou vendas.</div>
        ) : (
          <div className="space-y-6">
            {sales.map((sale: any) => (
              <div key={sale.order.id} className="bg-white p-4 rounded-lg shadow">
                <div className="mb-1 text-gray-600 text-sm">Pedido em {new Date(sale.order.createdAt).toLocaleString()}</div>
                <div className="mb-2">
                  Comprador: <span className="font-semibold">{sale.order.comprador.nome}</span>
                </div>
                <div>
                  {sale.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 border-b py-2 last:border-b-0">
                      <img alt={item.product.nome} src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${item.product.fotos[0]?.url || ''}`} className="w-16 h-16 object-cover rounded" />
                      <span>{item.product.nome}</span>
                      <span>x{item.quantidade}</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-2 text-breshop-navy">Pedido ID: {sale.order.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistoryPage;
