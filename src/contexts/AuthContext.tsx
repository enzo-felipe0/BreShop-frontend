import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService, { type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, tipoUsuario: 'COMPRADOR' | 'VENDEDOR') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const savedUser = authService.getUser();
    const savedToken = authService.getToken();

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await authService.login({ email, senha });
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    nome: string,
    email: string,
    senha: string,
    tipoUsuario: 'COMPRADOR' | 'VENDEDOR'
  ) => {
    try {
      const response = await authService.register({
        nome,
        email,
        senha,
        tipoUsuario,
      });
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
