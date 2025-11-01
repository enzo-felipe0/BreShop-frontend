# 🛍️ BreShop - E-commerce para Brechós Online

**BreShop** é uma plataforma de e-commerce voltada exclusivamente para brechós online, onde vendedores podem cadastrar seus produtos e compradores podem navegar, comprar e realizar pagamentos de forma segura e organizada.

> **+Um consumo consciente, sustentável & único**

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Paleta de Cores](#paleta-de-cores)
- [Autor](#autor)

---

## 🎯 Sobre o Projeto

O BreShop resolve o problema da desorganização nas vendas de brechós online, que atualmente dependem de redes sociais como Instagram e WhatsApp para divulgar produtos e negociar com clientes. A plataforma centraliza todo o processo de compra e venda, tornando-o mais eficiente, confiável e prático.

### Objetivos

- Organizar e profissionalizar a venda de produtos em brechós online
- Oferecer uma plataforma centralizada que simplifica a gestão de estoque, pagamentos e entregas
- Criar um ambiente especializado para consumidores conscientes

### Público-Alvo

- **Vendedores**: Donos de brechós virtuais que buscam uma plataforma estruturada para seus negócios
- **Compradores**: Pessoas que gostam de comprar roupas através de brechós e valorizam segurança e praticidade

---

## 🚀 Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first para estilização
- **React Router DOM v6** - Biblioteca de roteamento para navegação
- **Axios** - Cliente HTTP para requisições à API
- **Context API** - Gerenciamento de estado global

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para identificar e corrigir problemas no código
- **PostCSS** - Ferramenta para transformar CSS com plugins JavaScript
- **Autoprefixer** - Plugin PostCSS para adicionar prefixos de navegadores automaticamente

---

## ✨ Funcionalidades Implementadas

### Autenticação de Usuários

- ✅ **Cadastro de usuários** (vendedores e compradores) com validação de formulários
- ✅ **Login de usuários** com autenticação segura via JWT
- ✅ **Validação em tempo real** de campos de formulário
- ✅ **Diferenciação de tipos de usuário** (comprador/vendedor)
- ✅ **Logout seguro** com limpeza de token

### Gerenciamento de Estado

- ✅ **Context API** para estado de autenticação global
- ✅ **Persistência de sessão** em localStorage
- ✅ **Interceptadores Axios** para adicionar token automaticamente
- ✅ **Redirecionamento automático** ao token expirar

### Rotas e Navegação

- ✅ **Rotas públicas** (login, registro, home, produtos)
- ✅ **Rotas protegidas** para áreas autenticadas
- ✅ **Redirecionamentos inteligentes** (usuários autenticados não acessam login/register)
- ✅ **Navbar dinâmica** que responde ao estado de autenticação
- ✅ **Design responsivo** adaptável a diferentes tamanhos de tela

### Interface e Componentes

- ✅ **Input** - Componente de entrada com validação e mensagens de erro
- ✅ **Button** - Botão customizável com variantes de estilo
- ✅ **Navbar** - Barra de navegação reutilizável com links contextuais
- ✅ **AuthLayout** - Layout compartilhado para páginas de autenticação
- ✅ **ProtectedRoute** - Componente para proteger rotas
- ✅ **PublicRoute** - Componente para redirecionar usuários autenticados
- ✅ **Página 404** para rotas não encontradas
- ✅ **Paleta de cores personalizada** baseada na identidade visual do BreShop

---

## 📁 Estrutura do Projeto

```
breshop-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── types/
│   │   └── auth.types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (para clonar o repositório)
- **Backend BreShop** rodando em http://localhost:3333

---

## 🔧 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/breshop-frontend.git
cd breshop-frontend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Dependências Principais Instaladas

As seguintes dependências serão instaladas automaticamente:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
```

---

## ⚙️ Configuração

### 1. Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

**Importante:** No Vite, todas as variáveis de ambiente devem começar com `VITE_`

### 2. Verificar .gitignore

Certifique-se de que o arquivo `.gitignore` contém:

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## ▶️ Como Executar

### Pré-requisito: Backend Rodando

Certifique-se de que o backend está rodando em http://localhost:3000:

```bash
cd ../breshop-backend
npm run dev
```

### Modo de Desenvolvimento

Em outra aba do terminal, inicie o frontend:

```bash
cd breshop-frontend
npm run dev
```

O projeto estará disponível em: **http://localhost:5173**

### Build para Produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Preview da Build

```bash
npm run preview
```

---

## 🗺️ Rotas Disponíveis

| Rota | Tipo | Autenticado? | Descrição |
|------|------|-------------|-----------|
| `/` | Pública | Não importa | Página inicial com apresentação do BreShop |
| `/login` | Pública | Redireciona se sim | Página de autenticação de usuários |
| `/register` | Pública | Redireciona se sim | Página de cadastro de novos usuários |
| `/products` | Pública | Não importa | Página de catálogo de produtos |
| `*` | - | - | Página 404 para rotas não encontradas |

**Notas:**
- Rotas públicas redirecionam para `/` se o usuário já estiver autenticado
- `/products` é acessível por todos (com funcionalidades restritas para não autenticados futuramente)
- Não há rotas protegidas ainda, todas são públicas para teste

---

## 🎭 Gerenciamento de Estado

### Context API (AuthContext)

O estado de autenticação é gerenciado globalmente via **Context API**:

```typescript
const { user, token, loading, isAuthenticated, login, register, logout } = useAuth();
```

**Propriedades do Context:**

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `user` | User \| null | Dados do usuário logado |
| `token` | string \| null | Token JWT do usuário |
| `loading` | boolean | Indica se está carregando dados |
| `isAuthenticated` | boolean | Boolean indicando se está autenticado |
| `login()` | Function | Função para fazer login |
| `register()` | Function | Função para registrar novo usuário |
| `logout()` | Function | Função para fazer logout |

### Persistência de Sessão

O estado é persistido em `localStorage`:

- Token salvo em: `@breshop:token`
- Dados do usuário em: `@breshop:user`

A sessão é restaurada automaticamente ao recarregar a página.

### Interceptadores Axios

O serviço de API (`src/services/api.ts`) possui interceptadores que:

1. **Request:** Adiciona token JWT automaticamente em requisições autenticadas
2. **Response:** Trata erros 401 e redireciona para login se necessário

---

## 🔐 Autenticação e Autorização

### Como Funciona

1. Usuário faz login/cadastro
2. Backend retorna token JWT
3. Token é salvo no localStorage via AuthContext
4. Interceptador Axios adiciona token em requisições futuras
5. Se token expirar, usuário é redirecionado para login

### Rotas Protegidas

Use o componente `ProtectedRoute` para proteger páginas:

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Rotas Públicas com Redirecionamento

Use `PublicRoute` para páginas de autenticação que devem redirecionar usuários autenticados:

```typescript
<Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>
```

---

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| VITE_API_URL | URL da API backend | `http://localhost:3000/api` |

---

## 🎨 Paleta de Cores

O projeto utiliza uma paleta de cores personalizada inspirada no conceito de consumo consciente e sustentável:

| Cor | Código Hex | Uso |
|-----|-----------|------|
| **Beige** | `#F5E6D3` | Background principal, tons neutros |
| **Pink** | `#E8A5A0` | Botões secundários, destaques |
| **Navy** | `#2C3E50` | Textos principais, botões primários |
| **Gold** | `#B8A76B` | Bordas, acentos, estados hover |
| **Coral** | `#D89B94` | Elementos de validação, destaques secundários |

### Como Usar as Cores

As cores estão configuradas no `tailwind.config.js` e podem ser usadas como classes Tailwind:

```typescript
<div className="bg-breshop-beige text-breshop-navy">
  <button className="bg-breshop-navy hover:bg-breshop-gold">
    Entrar
  </button>
  <button className="bg-breshop-pink hover:bg-breshop-coral">
    Cadastrar
  </button>
</div>
```

---

## 📄 Requisitos Funcionais Implementados

Conforme o PRD (Product Requirements Document):

- ✅ **RF01**: O sistema permite que o vendedor crie uma conta informando nome, e-mail, senha e tipo de usuário
- ✅ **RF02**: O sistema autentica os usuários através de e-mail e senha
- 🔄 **RF03**: O sistema deve permitir que o vendedor cadastre produtos com nome, descrição, preço, quantidade e fotos.

- 🔄 **RF04**: O sistema deve exibir os produtos cadastrados em um catálogo acessível ao público.

- 🔄 **RF05**: O sistema deve permitir que o comprador adicione produtos ao carrinho e finalize a compra.

- 🔄 **RF06**: O sistema deve registrar e exibir o histórico de compras e vendas de cada usuário.

- 🔄 **RF07**: O sistema deve atualizar automaticamente o estoque após cada venda concluída.

- 🔄 **RF08**: O sistema deve permitir que o comprador acompanhe o status do pedido (em processamento, enviado, entregue).

- 🔄 **RF09**: O sistema deve permitir que o usuário edite informações básicas do seu perfil, como nome e senha.

- 🔄 **RF10**: O sistema deve enviar notificações ou confirmações de pedido por e-mail.
---

## 🧪 Testar a Aplicação

### Fluxo Completo

1. Certifique-se de que o backend está rodando: `http://localhost:3000`
2. Inicie o frontend: `npm run dev`
3. Abra http://localhost:5173 no navegador
4. Clique em "Cadastrar"
5. Preencha o formulário de registro
6. Clique em "Cadastrar"
7. Você será redirecionado para a home e seu nome aparecerá na navbar
8. Clique em "Sair" para fazer logout
9. Tente acessar `/products` (funciona para todos)
10. Clique em "Entrar" para fazer login novamente

## 👨‍💻 Autor

**Enzo Felipe Prudencio Avelino Lima**  
Matrícula: 20240065606

---

## 📝 Licença

Este projeto foi desenvolvido como parte de um trabalho acadêmico.