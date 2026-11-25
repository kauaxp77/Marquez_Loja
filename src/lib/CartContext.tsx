"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product, Size, getProductById, getFinalPrice } from "./data";
import { roundMoney } from "./store";

export interface CartItem {
    product: Product;
    size: Size;
    quantity: number;
}

// O navegador guarda só id, tamanho e quantidade. Nome, preço e estoque vêm sempre do catálogo atual,
// assim uma atualização de preço feita na manutenção vale também para sacolas já abertas.
interface StoredItem {
    productId: string;
    size: Size;
    quantity: number;
}

export type AddResult = { ok: true; added: number } | { ok: false; reason: "esgotado" | "limite" };

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, size: Size, quantity: number) => AddResult;
    removeFromCart: (productId: string, size: Size) => void;
    updateQuantity: (productId: string, size: Size, quantity: number) => void;
    clearCart: () => void;
    getRemainingStock: (product: Product) => number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    itemCount: number;
}

const STORAGE_KEY = "marquez_cart_v2";

const CartContext = createContext<CartContextType | undefined>(undefined);

function inCartFor(items: StoredItem[], productId: string): number {
    return items.filter((i) => i.productId === productId).reduce((n, i) => n + i.quantity, 0);
}

// Remove itens que saíram do catálogo e limita as quantidades ao estoque disponível.
function sanitize(items: StoredItem[]): StoredItem[] {
    const result: StoredItem[] = [];
    for (const item of items) {
        const product = getProductById(item.productId);
        if (!product || !product.sizes.includes(item.size)) continue;
        const room = product.stock - inCartFor(result, product.id);
        const quantity = Math.min(Math.floor(item.quantity), room);
        if (quantity > 0) result.push({ productId: item.productId, size: item.size, quantity });
    }
    return result;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<StoredItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do localStorage após montar
                if (Array.isArray(parsed)) setItems(sanitize(parsed));
            }
            localStorage.removeItem("marquez_cart"); // formato antigo, que guardava o produto inteiro (com preço)
        } catch {
            // sacola corrompida: começa vazia
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, isLoaded]);

    // Trava a rolagem da página enquanto a sacola está aberta.
    useEffect(() => {
        document.body.style.overflow = isCartOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isCartOpen]);

    const getRemainingStock = useCallback(
        (product: Product) => Math.max(0, product.stock - inCartFor(items, product.id)),
        [items]
    );

    const addToCart = useCallback((product: Product, size: Size, quantity: number): AddResult => {
        if (product.stock <= 0) return { ok: false, reason: "esgotado" };
        const room = product.stock - inCartFor(items, product.id);
        const added = Math.min(quantity, room);
        if (added <= 0) return { ok: false, reason: "limite" };

        setItems((prev) => {
            const existing = prev.find((i) => i.productId === product.id && i.size === size);
            if (existing) {
                return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + added } : i));
            }
            return [...prev, { productId: product.id, size, quantity: added }];
        });
        return { ok: true, added };
    }, [items]);

    const removeFromCart = useCallback((productId: string, size: Size) => {
        setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
    }, []);

    const updateQuantity = useCallback((productId: string, size: Size, quantity: number) => {
        setItems((prev) => {
            if (quantity < 1) return prev.filter((i) => !(i.productId === productId && i.size === size));
            const product = getProductById(productId);
            if (!product) return prev;
            const others = prev
                .filter((i) => i.productId === productId && i.size !== size)
                .reduce((n, i) => n + i.quantity, 0);
            const capped = Math.min(quantity, product.stock - others);
            return prev.map((i) =>
                i.productId === productId && i.size === size ? { ...i, quantity: Math.max(1, capped) } : i
            );
        });
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const cartItems = useMemo<CartItem[]>(
        () =>
            items.flatMap((i) => {
                const product = getProductById(i.productId);
                return product ? [{ product, size: i.size, quantity: i.quantity }] : [];
            }),
        [items]
    );

    const cartTotal = roundMoney(cartItems.reduce((t, i) => t + getFinalPrice(i.product) * i.quantity, 0));
    const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getRemainingStock,
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
