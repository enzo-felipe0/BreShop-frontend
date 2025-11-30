export interface User {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'COMPRADOR' | 'VENDEDOR';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  nome?: string;
  senhaAtual?: string;
  novaSenha?: string;
}
