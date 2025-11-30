import React from 'react';
import { type OrderStatus } from '../../types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
    PENDENTE: {
      label: 'Pendente',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100 border-yellow-300'
    },
    PROCESSANDO: {
      label: 'Processando',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100 border-blue-300'
    },
    ENVIADO: {
      label: 'Enviado',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100 border-purple-300'
    },
    ENTREGUE: {
      label: 'Entregue',
      color: 'text-green-700',
      bgColor: 'bg-green-100 border-green-300'
    },
    CANCELADO: {
      label: 'Cancelado',
      color: 'text-red-700',
      bgColor: 'bg-red-100 border-red-300'
    }
  };

  const config = statusConfig[status];
  
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border-2 ${config.color} ${config.bgColor} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
