import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

type AuthView = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <AuthLayout>
      {currentView === 'login' ? (
        <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </AuthLayout>
  );
};

export default AuthPage;
