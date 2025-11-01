# 🛍️ BreShop - E-commerce para Brechós Online

**BreShop** é uma plataforma de e-commerce voltada exclusivamente para brechós online, onde vendedores podem cadastrar seus produtos e compradores podem navegar, comprar e realizar pagamentos de forma segura e organizada.

> **Um consumo consciente, sustentável & único**

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Rotas Disponíveis](#rotas-disponíveis)
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

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para identificar e corrigir problemas no código
- **PostCSS** - Ferramenta para transformar CSS com plugins JavaScript
- **Autoprefixer** - Plugin PostCSS para adicionar prefixos de navegadores automaticamente

---

## ✨ Funcionalidades Implementadas

### Autenticação de Usuários

- ✅ **Cadastro de usuários** (vendedores e compradores) com validação de formulários
- ✅ **Login de usuários** com autenticação segura
- ✅ **Validação em tempo real** de campos de formulário
- ✅ **Diferenciação de tipos de usuário** (comprador/vendedor)

### Interface e Navegação

- ✅ **Sistema de rotas** com React Router v6
- ✅ **Design responsivo** adaptável a diferentes tamanhos de tela
- ✅ **Página inicial** com apresentação do projeto
- ✅ **Página 404** para rotas não encontradas
- ✅ **Paleta de cores personalizada** baseada na identidade visual do BreShop

### Componentes Reutilizáveis

- ✅ **Input** - Componente de entrada com validação e mensagens de erro
- ✅ **Button** - Botão customizável com variantes de estilo
- ✅ **AuthLayout** - Layout compartilhado para páginas de autenticação

---

## 📁 Estrutura do Projeto


```
breshop-frontend/
├── src/
│ ├── components/
│ │ ├── auth/
│ │ │ ├── AuthLayout.tsx # Layout para páginas de autenticação
│ │ │ ├── LoginForm.tsx # Formulário de login
│ │ │ └── RegisterForm.tsx # Formulário de registro
│ │ └── common/
│ │ ├── Button.tsx # Componente de botão reutilizável
│ │ └── Input.tsx # Componente de input reutilizável
│ ├── pages/
│ │ ├── auth/
│ │ │ ├── LoginPage.tsx # Página de login
│ │ │ └── RegisterPage.tsx # Página de registro
│ │ ├── HomePage.tsx # Página inicial
│ │ ├── ProductsPage.tsx # Página de produtos (placeholder)
│ │ └── NotFoundPage.tsx # Página 404
│ ├── types/
│ │ └── auth.types.ts # Tipos TypeScript para autenticação
│ ├── App.tsx # Configuração de rotas principais
│ ├── main.tsx # Ponto de entrada da aplicação
│ └── index.css # Estilos globais com Tailwind
├── public/ # Arquivos estáticos
├── index.html # HTML principal
├── package.json # Dependências e scripts
├── tailwind.config.js # Configuração do Tailwind CSS
├── tsconfig.json # Configuração do TypeScript
├── vite.config.ts # Configuração do Vite
└── README.md # Documentação do projeto
---
```

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (para clonar o repositório)

---

## 🔧 Instalação

### 1. Clone o repositório

```
git clone https://github.com/seu-usuario/breshop-frontend.git
cd breshop-frontend
```

### 2. Instale as dependências

```
npm install
```

## ▶️ Como Executar

### Modo de Desenvolvimento

Inicie o servidor de desenvolvimento:

```
npm run dev
```

O projeto estará disponível em: [**http://localhost:5173/**](http://localhost:5173/)

### Build para Produção

Para gerar a versão otimizada para produção:

```
npm run build
```

---

## 🗺️ Rotas Disponíveis

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `HomePage` | Página inicial com apresentação do BreShop |
| `/login` | `LoginPage` | Página de autenticação de usuários |
| `/register` | `RegisterPage` | Página de cadastro de novos usuários |
| `/products` | `ProductsPage` | Página de catálogo de produtos (em desenvolvimento) |
| `*` (qualquer outra) | `NotFoundPage` | Página 404 para rotas não encontradas |

## 🎨 Paleta de Cores

O projeto utiliza uma paleta de cores personalizada inspirada no conceito de consumo consciente e sustentável:

| Cor | Código Hex | Uso |
|-----|-----------|------|
| **Beige** | `#F5E6D3` | Background principal, tons neutros |
| **Pink** | `#E8A5A0` | Botões secundários, destaques |
| **Navy** | `#2C3E50` | Textos principais, botões primários |
| **Gold** | `#B8A76B` | Bordas, acentos, estados hover |
| **Coral** | `#D89B94` | Elementos de validação, destaques secundários |

📄 Requisitos Funcionais Implementados
Conforme o PRD (Product Requirements Document):

✅ RF01: O sistema permite que o vendedor crie uma conta informando nome, e-mail, senha e tipo de usuário

✅ RF02: O sistema autentica os usuários através de e-mail e senha

🔄 RF03: Cadastro de produtos (próximo passo)

🔄 RF04: Exibição de catálogo público (próximo passo)

🔄 RF05: Carrinho de compras e checkout (próximo passo)

## 👨‍💻 Autor
Enzo Felipe Prudencio Avelino Lima
Matrícula: 20240065606

## 📝 Licença
Este projeto foi desenvolvido como parte de um trabalho acadêmico.
