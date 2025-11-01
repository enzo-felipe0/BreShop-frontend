// Usando object literal com 'as const' - compatível com erasableSyntaxOnly
export const UserType = {
  BUYER: 'comprador',
  SELLER: 'vendedor'
} as const;

// Criando o tipo a partir do objeto
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
