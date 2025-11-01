import api from './api';

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: 'COMPRADOR' | 'VENDEDOR';
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'COMPRADOR' | 'VENDEDOR';
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('@breshop:token', response.data.token);
    localStorage.setItem('@breshop:user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('@breshop:token', response.data.token);
    localStorage.setItem('@breshop:user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('@breshop:token');
    localStorage.removeItem('@breshop:user');
  }

  getToken(): string | null {
    return localStorage.getItem('@breshop:token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('@breshop:user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
