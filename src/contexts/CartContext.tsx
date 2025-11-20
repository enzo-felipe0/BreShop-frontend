import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// Tipos
interface Product {
  id: string;
  nome: string;
  preco: number;
  fotos: { url: string }[];
}

export interface CartItem {
  product: Product;
  quantidade: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<any>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(`@breshop:cart:${user?.id}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]); // Limpa o carrinho se o usuário mudar
    }
  }, [user]);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(`@breshop:cart:${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantidade: item.quantidade + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantidade: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantidade: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`@breshop:cart:${user.id}`);
    }
  };

  const checkout = async () => {
    const itemsToCheckout = cartItems.map(item => ({
      productId: item.product.id,
      quantidade: item.quantidade,
    }));
    
    const response = await cartService.checkout(itemsToCheckout);
    clearCart(); // Limpa o carrinho após a compra
    return response.data;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.preco * item.quantidade, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
