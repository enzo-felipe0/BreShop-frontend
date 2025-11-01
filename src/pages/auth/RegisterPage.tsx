import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <RegisterForm onSwitchToLogin={() => navigate('/login')} />
    </AuthLayout>
  );
};

export default RegisterPage;
