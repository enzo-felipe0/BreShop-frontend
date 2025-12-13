import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LoginFormData } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      alert('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Bem-vindo de volta!
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Entre para continuar suas compras
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <Input
          label="E-mail"
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          error={errors.email}
        />

        <Input
          label="Senha"
          type="password"
          id="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
          error={errors.senha}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-2 focus:ring-pink-500 cursor-pointer"
            />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
              Lembrar-me
            </span>
          </label>
          <button
            type="button"
            className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Entrar
            </>
          )}
        </button>
      </form>

      <div className="mt-6 sm:mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Novo por aqui?</span>
          </div>
        </div>

        <button
          onClick={onSwitchToRegister}
          type="button"
          className="mt-4 w-full border-2 border-gray-300 text-gray-700 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
        >
          Criar uma conta
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
