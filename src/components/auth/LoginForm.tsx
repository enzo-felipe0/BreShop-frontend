import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LoginFormData } from '../../types/auth.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados de login:', formData);
      // Aqui você fará a integração com a API backend
      alert('Login realizado com sucesso!');
      
      // Redirecionar para home após login
      navigate('/');
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

        <Button type="submit" variant="primary" fullWidth>
          Entrar
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-breshop-navy/70">
          Não tem uma conta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-breshop-navy font-semibold hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
