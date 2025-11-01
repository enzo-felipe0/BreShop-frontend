import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LoginFormData } from '../../types/auth.types';
import Input from '../common/Input';
import Button from '../common/Button';
import authService from '../../services/authService';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
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
      await authService.login({
        email: formData.email,
        senha: formData.senha,
      });

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
      <h2 className="text-2xl font-bold text-breshop-navy mb-6 text-center">
        Entrar
      </h2>
      
      <form onSubmit={handleSubmit}>
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

        <div className="mb-6 text-right">
          <button
            type="button"
            className="text-sm text-breshop-navy/70 hover:text-breshop-navy hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-breshop-navy/70">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-breshop-navy font-semibold hover:underline"
            type="button"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
