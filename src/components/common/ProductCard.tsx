import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
  id: number | string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  quantidade?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showCartButton?: boolean;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  showCartButton = false,
  disabled = false
}) => {
  const isOutOfStock = product.quantidade !== undefined && product.quantidade === 0;
  const isLowStock = product.quantidade !== undefined && product.quantidade > 0 && product.quantidade <= 5;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-pink-300 flex flex-col h-full transform hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* Área da Imagem - Altura Responsiva */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imagemUrl ? (
          <img 
            src={product.imagemUrl} 
            alt={product.nome} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Sem imagem</span>
          </div>
        )}
        
        {/* Badges de Status - Tamanho Responsivo */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              ESGOTADO
            </span>
          ) : isLowStock ? (
            <span className="bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              ÚLTIMAS {product.quantidade}
            </span>
          ) : (
            <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              NOVO
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo do Card - Padding Responsivo */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow bg-white">
        {/* Título - Tamanho Responsivo */}
        <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
          {product.nome}
        </h3>
        
        {/* Descrição - Tamanho Responsivo */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.descricao || 'Peça única, estilo autêntico.'}
        </p>
        
        <div className="mt-auto space-y-2 sm:space-y-3">
          {/* Preço - Tamanho Responsivo */}
          <div className="pt-3 sm:pt-4 border-t border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Preço</p>
            <span className="text-pink-600 font-extrabold text-xl sm:text-2xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
            </span>
          </div>

          {/* Botões de Ação - Layout Responsivo */}
          <div className={`flex ${showCartButton ? 'flex-col xs:flex-row' : 'flex-row'} gap-2`}>
            {/* Botão Ver Detalhes */}
            <Link 
              to={`/products/${product.id}`}
              className={`${showCartButton ? 'flex-1' : 'w-full'} flex items-center justify-center gap-1 bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-all duration-300 group/btn min-h-[40px] sm:min-h-[44px]`}
            >
              <span className="hidden xs:inline">Ver</span>
              <span className="xs:hidden">Ver Detalhes</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Botão Adicionar ao Carrinho (condicional) */}
            {showCartButton && onAddToCart && (
              <button
                onClick={() => onAddToCart(product)}
                disabled={disabled || isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 min-h-[40px] sm:min-h-[44px] ${
                  disabled || isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-0.5'
                }`}
                title={isOutOfStock ? 'Produto esgotado' : 'Adicionar ao carrinho'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden xs:inline">
                  {isOutOfStock ? 'Esgotado' : 'Carrinho'}
                </span>
                <span className="xs:hidden">
                  {isOutOfStock ? 'Indisponível' : 'Adicionar'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
