import api from './api';

interface CartItemPayload {
  productId: string;
  quantidade: number;
}

const checkout = (items: CartItemPayload[]) => {
  return api.post('/cart/checkout', { items });
};

export default {
  checkout,
};
