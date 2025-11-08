import api from './api';

const createProduct = (formData: FormData) => {
  return api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const getAllProducts = () => {
  return api.get('/products');
};

const getProductById = (id: string) => {
  return api.get(`/products/${id}`);
};

const getMyProducts = () => {
  return api.get('/products/vendedor/meus-produtos');
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
};
