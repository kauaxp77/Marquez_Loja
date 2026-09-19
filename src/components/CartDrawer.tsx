"use client";

import { useCart } from "@/lib/CartContext";
import { X, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    const handleCheckout = () => {
        // We will redirect to a small form before WhatsApp later
        window.location.href = "/checkout";
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#080808] z-50 border-l border-[#1C1C1C] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#1C1C1C]">
                            <h2 className="text-xl font-medium tracking-widest text-white">SUA SACOLA ({cartItems.length})</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#BFC0C2]">
                                    <p className="text-lg tracking-wide mb-4">Sua sacola está vazia.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm text-white"
                                    >
                                        Explorar Coleção
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-32 bg-[#121212] flex-shrink-0 relative overflow-hidden">
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-sm font-medium text-white uppercase pr-4">{item.product.name}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.product.id, item.size)}
                                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-[#BFC0C2] mt-1">TAMANHO: {item.size}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-[#1C1C1C]">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[#121212] transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3 text-white" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-[#121212] transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3 text-white" />
                                                        </button>
                                                    </div>
                                                    <p className="font-medium text-white text-sm">
                                                        R$ {((item.product.promotionalPrice || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-[#1C1C1C] p-6 bg-[#080808]">
                                <div className="flex items-center justify-between mb-6 text-white text-lg">
                                    <span className="tracking-wide">SUBTOTAL</span>
                                    <span className="font-medium">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-white text-black font-semibold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-[#E5E5E5] transition-colors"
                                >
                                    Finalizar Pedido Selecionado
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
