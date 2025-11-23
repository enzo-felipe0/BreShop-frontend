import api from './api';

const getMyPurchases = () => api.get('/orders/minhas-compras');
const getMySales = () => api.get('/orders/minhas-vendas');

export default {
  getMyPurchases,
  getMySales,
};
