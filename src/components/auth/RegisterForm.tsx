import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType, type RegisterFormData } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: UserType.BUYER
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
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
      await register(
        formData.nome,
        formData.email,
        formData.senha,
        formData.tipoUsuario.toUpperCase() as 'COMPRADOR' | 'VENDEDOR'
      );

      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao realizar cadastro';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Crie sua conta
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Junte-se à comunidade BreShop
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          type="text"
          id="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite seu nome"
          required
          error={errors.nome}
        />

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
          placeholder="Mínimo 6 caracteres"
          required
          error={errors.senha}
        />

        <Input
          label="Confirmar Senha"
          type="password"
          id="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          placeholder="Digite a senha novamente"
          required
          error={errors.confirmarSenha}
        />

        {/* Tipo de Conta com Cards */}
        <div>
          <label className="block text-gray-900 font-semibold mb-3 text-sm sm:text-base">
            Tipo de Conta <span className="text-pink-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: UserType.BUYER }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.tipoUsuario === UserType.BUYER
                  ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  formData.tipoUsuario === UserType.BUYER ? 'bg-pink-500' : 'bg-gray-200'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${formData.tipoUsuario === UserType.BUYER ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${formData.tipoUsuario === UserType.BUYER ? 'text-pink-600' : 'text-gray-700'}`}>
                  Comprador
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: UserType.SELLER }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.tipoUsuario === UserType.SELLER
                  ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  formData.tipoUsuario === UserType.SELLER ? 'bg-pink-500' : 'bg-gray-200'
                }`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${formData.tipoUsuario === UserType.SELLER ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`font-semibold text-sm sm:text-base ${formData.tipoUsuario === UserType.SELLER ? 'text-pink-600' : 'text-gray-700'}`}>
                  Vendedor
                </span>
              </div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cadastrando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Criar Conta
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
            <span className="px-4 bg-white text-gray-500">Já tem uma conta?</span>
          </div>
        </div>

        <button
          onClick={onSwitchToLogin}
          type="button"
          className="mt-4 w-full border-2 border-gray-300 text-gray-700 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
