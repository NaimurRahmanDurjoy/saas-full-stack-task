import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // localStorage natively securely synchronizing unauthenticated customer intents!
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('saas_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('saas_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (variant, product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.variant.id === variant.id);
            if (existing) {
                return prev.map(item =>
                    item.variant.id === variant.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { variant, product, quantity }];
        });
    };

    const updateQuantity = (variantId, quantity) => {
        setCart(prev => prev.map(item =>
            item.variant.id === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const removeFromCart = (variantId) => {
        setCart(prev => prev.filter(item => item.variant.id !== variantId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.variant.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
