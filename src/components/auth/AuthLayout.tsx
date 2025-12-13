import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo e Tagline */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/50 mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 sm:mb-3 font-display">
            BreShop
          </h1>
          <p className="text-gray-300 text-sm sm:text-base px-4">
            Moda consciente • Sustentável • Única
          </p>
        </div>
        
        {/* Card do formulário */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-6">
          &copy; {new Date().getFullYear()} BreShop. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
