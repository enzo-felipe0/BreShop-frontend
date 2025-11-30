import api from './api';

interface UpdateProfileData {
  nome?: string;
  senhaAtual?: string;
  novaSenha?: string;
}

const getProfile = () => {
  return api.get('/users/profile');
};

const updateProfile = (data: UpdateProfileData) => {
  return api.put('/users/profile', data);
};

const validatePassword = (senha: string) => {
  return api.post('/users/validate-password', { senha });
};

export default {
  getProfile,
  updateProfile,
  validatePassword,
};
