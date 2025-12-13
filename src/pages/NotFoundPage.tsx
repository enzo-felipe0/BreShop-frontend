import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Conteúdo - Adicionado pt-16 sm:pt-20 para empurrar para baixo */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4 pt-16 sm:pt-20">
        {/* Ilustração 404 */}
        <div className="mb-6 sm:mb-8">
          <div className="relative inline-block">
            {/* Número 404 */}
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold font-display mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 drop-shadow-lg">
                404
              </span>
            </h1>
            
            {/* Ícone de sacola triste */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 animate-bounce">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4">
          Oops! Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed px-4">
          Parece que esta página foi para o brechó e não voltou mais. 
          Mas não se preocupe, temos muitas outras peças incríveis esperando por você!
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link 
            to="/" 
            className="group w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voltar para Home
          </Link>

          <Link 
            to="/products" 
            className="group w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ver Produtos
          </Link>
        </div>

        {/* Sugestões úteis */}
        <div className="mt-12 sm:mt-16">
          <p className="text-gray-400 text-sm sm:text-base mb-4">Você pode estar procurando por:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link 
              to="/products" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 text-sm hover:text-white transition-all"
            >
              🛍️ Produtos
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 text-sm hover:text-white transition-all"
            >
              🔑 Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 text-sm hover:text-white transition-all"
            >
              ✨ Cadastro
            </Link>
          </div>
        </div>

        {/* Código de erro (decorativo) */}
        <div className="mt-12 sm:mt-16 mb-20">
          <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-xs sm:text-sm text-gray-500 font-mono">Error Code</p>
                <p className="text-sm sm:text-base text-gray-300 font-mono font-semibold">HTTP 404 - Not Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimalista */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} BreShop. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
