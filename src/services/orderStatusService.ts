import api from './api';

const getMyOrders = () => {
  return api.get('/order-status/minhas-compras');
};

const getOrderById = (orderId: string) => {
  return api.get(`/order-status/${orderId}`);
};

const forceUpdateStatus = (orderId: string) => {
  return api.post(`/order-status/${orderId}/force-update`);
};

export default {
  getMyOrders,
  getOrderById,
  forceUpdateStatus,
};
