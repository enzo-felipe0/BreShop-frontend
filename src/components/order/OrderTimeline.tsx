import React from 'react';
import { type OrderStatus } from '../../types/order.types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusUpdatedAt: string;
  estimatedNextUpdate: string | null;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ 
  currentStatus, 
  statusUpdatedAt,
  estimatedNextUpdate 
}) => {
  const statuses: Array<{ status: OrderStatus; label: string; icon: string }> = [
    { status: 'PENDENTE', label: 'Pedido Recebido', icon: '📝' },
    { status: 'PROCESSANDO', label: 'Em Processamento', icon: '📦' },
    { status: 'ENVIADO', label: 'Enviado', icon: '🚚' },
    { status: 'ENTREGUE', label: 'Entregue', icon: '✅' },
  ];

  const currentIndex = statuses.findIndex(s => s.status === currentStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-6">
      <div className="relative">
        {/* Linha de progresso */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-breshop-navy transition-all duration-500"
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status */}
        <div className="relative flex justify-between">
          {statuses.map((statusItem, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = statusItem.status === currentStatus;

            return (
              <div key={statusItem.status} className="flex flex-col items-center">
                {/* Ícone */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                    isCompleted
                      ? 'bg-breshop-navy text-white scale-110'
                      : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-breshop-gold' : ''}`}
                >
                  {statusItem.icon}
                </div>

                {/* Label */}
                <p
                  className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                    isCompleted ? 'text-breshop-navy' : 'text-gray-400'
                  }`}
                >
                  {statusItem.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações de tempo */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Última atualização:</span>{' '}
          {formatDate(statusUpdatedAt)}
        </p>
        {estimatedNextUpdate && currentStatus !== 'ENTREGUE' && currentStatus !== 'CANCELADO' && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Próxima atualização prevista:</span>{' '}
            {formatDate(estimatedNextUpdate)}
          </p>
        )}
        {currentStatus === 'ENTREGUE' && (
          <p className="text-sm text-green-600 font-semibold">
            ✅ Seu pedido foi entregue com sucesso!
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;
