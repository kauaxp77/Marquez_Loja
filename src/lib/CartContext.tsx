"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Size } from "./data";

export interface CartItem {
    product: Product;
    size: Size;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, size: Size, quantity: number) => void;
    removeFromCart: (productId: string, size: Size) => void;
    updateQuantity: (productId: string, size: Size, quantity: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("marquez_cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("marquez_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isMounted]);

    const addToCart = (product: Product, size: Size, quantity: number) => {
        setCartItems((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id && item.size === size
            );
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, size, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, size: Size) => {
        setCartItems((prev) =>
            prev.filter((item) => !(item.product.id === productId && item.size === size))
        );
    };

    const updateQuantity = (productId: string, size: Size, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId, size);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.product.id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.product.promotionalPrice || item.product.price) * item.quantity,
        0
    );

    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                isCartOpen,
                setIsCartOpen,
                cartTotal,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
