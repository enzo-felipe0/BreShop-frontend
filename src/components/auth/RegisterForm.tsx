import React, { useState } from 'react';
import type { RegisterFormData } from '../../types/auth.types';
import { UserType } from '../../types/auth.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
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
    // Limpar erro do campo quando usuário começar a digitar
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados de registro:', formData);
      // Aqui você fará a integração com a API backend
      alert('Cadastro realizado com sucesso!');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-breshop-navy mb-6 text-center">
        Criar Conta
      </h2>
      
      <form onSubmit={handleSubmit}>
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

        <div className="mb-6">
          <label className="block text-breshop-navy font-medium mb-2">
            Tipo de Conta <span className="text-breshop-coral">*</span>
          </label>
          <select
            id="tipoUsuario"
            value={formData.tipoUsuario}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-breshop-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-breshop-gold focus:border-breshop-gold"
          >
            <option value={UserType.BUYER}>Comprador</option>
            <option value={UserType.SELLER}>Vendedor</option>
          </select>
        </div>

        <Button type="submit" variant="primary" fullWidth>
          Cadastrar
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-breshop-navy/70">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-breshop-navy font-semibold hover:underline"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
