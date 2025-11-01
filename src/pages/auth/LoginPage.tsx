import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <LoginForm onSwitchToRegister={() => navigate('/register')} />
    </AuthLayout>
  );
};

export default LoginPage;
