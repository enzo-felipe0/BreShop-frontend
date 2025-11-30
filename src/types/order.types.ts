export type OrderStatus = 'PENDENTE' | 'PROCESSANDO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

export interface OrderItem {
  id: string;
  quantidade: number;
  preco: number;
  product: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    fotos: Array<{
      id: string;
      url: string;
    }>;
    vendedor: {
      nome: string;
      email: string;
    };
  };
}

export interface Order {
  id: string;
  compradorId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  statusUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  estimatedNextUpdate: string | null;
}

export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  color: string;
  icon: string;
  description: string;
}
