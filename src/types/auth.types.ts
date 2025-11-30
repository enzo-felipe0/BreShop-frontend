export const UserType = {
  BUYER: 'comprador',
  SELLER: 'vendedor'
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: UserType;
}

export interface LoginFormData {
  email: string;
  senha: string;
}
