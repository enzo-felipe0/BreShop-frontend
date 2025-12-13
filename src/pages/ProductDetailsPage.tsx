import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import productService from '../services/productService';

interface Seller {
    id: string;
    nome: string;
    email: string;
}

interface ProductPhoto {
    id: string;
    url: string;
    productId: string;
    createdAt: string;
}

interface Product {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    fotos: ProductPhoto[]; // 🔥 ARRAY, NÃO STRING
    vendedor: Seller;
    createdAt: string;
}

const ProductDetailsPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductById(productId!);
            console.log('📦 Produto carregado:', response.data);
            setProduct(response.data);
        } catch (error: any) {
            console.error('Erro ao carregar produto:', error);
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            alert('Você precisa estar logado para adicionar produtos ao carrinho');
            navigate('/login');
            return;
        }

        if (user.tipoUsuario !== 'COMPRADOR') {
            alert('Apenas compradores podem adicionar produtos ao carrinho');
            return;
        }

        if (product) {
            addToCart(
                {
                    id: product.id,
                    nome: product.nome,
                    preco: product.preco,
                    fotos: product.fotos, // Já é array
                },
                quantidadeDesejada
            );
            alert(`${quantidadeDesejada}x "${product.nome}" adicionado ao carrinho!`);
        }
    };

    const incrementQuantity = () => {
        if (product && quantidadeDesejada < product.quantidade) {
            setQuantidadeDesejada(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantidadeDesejada > 1) {
            setQuantidadeDesejada(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex flex-col justify-center items-center flex-grow">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-500 mb-4"></div>
                    <p className="text-gray-600 font-medium">Carregando produto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const isOutOfStock = product.quantidade === 0;
    const canAddToCart = user?.tipoUsuario === 'COMPRADOR' && !isOutOfStock;

    // 🔥 PEGA A PRIMEIRA FOTO DO ARRAY
    const imageUrl = product.fotos && product.fotos.length > 0
        ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.fotos[0].url}`
        : null;

    console.log('🎯 URL final da imagem:', imageUrl);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-6xl">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-pink-600 transition-colors text-sm group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar para produtos
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Imagem do Produto */}
                    <div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden aspect-square">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.nome}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                                    <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">Sem imagem</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="space-y-4">
                        {/* Título e Preço */}
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                {product.nome}
                            </h1>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                                </span>
                                {!isOutOfStock && (
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        ou 3x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco / 3)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Status de Estoque */}
                        <div>
                            {isOutOfStock ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold text-xs sm:text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Fora de estoque
                                </span>
                            ) : product.quantidade <= 5 ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg font-semibold text-xs sm:text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Últimas {product.quantidade} unidades!
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold text-xs sm:text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {product.quantidade} em estoque
                                </span>
                            )}
                        </div>

                        {/* Seletor de Quantidade */}
                        {canAddToCart && (
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <label className="block text-gray-900 font-semibold mb-2 text-xs sm:text-sm">
                                    Quantidade
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantidadeDesejada <= 1}
                                        className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">
                                        {quantidadeDesejada}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={quantidadeDesejada >= product.quantidade}
                                        className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Botão de Adicionar ao Carrinho */}
                        {canAddToCart ? (
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Adicionar ao Carrinho
                            </button>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-3 text-center border border-gray-200">
                                <p className="text-gray-600 font-medium text-xs sm:text-sm">
                                    {!user
                                        ? 'Faça login para adicionar ao carrinho'
                                        : user.tipoUsuario !== 'COMPRADOR'
                                            ? 'Apenas compradores podem adicionar ao carrinho'
                                            : 'Produto indisponível'}
                                </p>
                            </div>
                        )}

                        {/* Descrição */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                            <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Descrição
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                                {product.descricao}
                            </p>
                        </div>

                        {/* Informações do Vendedor */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200 p-3">
                            <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Vendedor
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {product.vendedor.nome.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs sm:text-sm">{product.vendedor.nome}</p>
                                    <p className="text-xs text-gray-600">{product.vendedor.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-xs text-blue-900">
                                    <p className="font-semibold">Compra Segura</p>
                                    <p className="text-blue-800">Cadastrado em {new Date(product.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-auto">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} BreShop. Consumo consciente, futuro sustentável.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetailsPage;
