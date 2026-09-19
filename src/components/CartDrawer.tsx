"use client";

import { useCart } from "@/lib/CartContext";
import { X, Minus, Plus, ShoppingBag, Truck, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 350;

export function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        setIsCartOpen(false);
        router.push("/checkout");
    };

    const progress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
    const amountLeft = FREE_SHIPPING_THRESHOLD - cartTotal;

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
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 right-0 bottom-0 w-full md:w-[460px] bg-[#0e0e11] z-50 border-l border-white/10 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">
                                    Resumo do Carrinho
                                </span>
                                <h2 className="text-lg font-bold font-display tracking-wider text-white uppercase">
                                    Sua Sacola ({cartItems.length})
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                aria-label="Fechar sacola"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Free Shipping Dynamic Progress Bar */}
                        <div className="bg-zinc-950/80 px-6 py-4 border-b border-white/10">
                            <div className="flex items-center justify-between text-xs tracking-wide mb-2 font-medium">
                                <span className="flex items-center gap-1.5 text-zinc-300">
                                    <Truck className="w-4 h-4 text-white" />
                                    {amountLeft <= 0 ? (
                                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Parabéns! Você ganhou Frete Grátis
                                        </span>
                                    ) : (
                                        <span>
                                            Faltam <strong className="text-white font-mono">R$ {amountLeft.toFixed(2).replace('.', ',')}</strong> para frete grátis
                                        </span>
                                    )}
                                </span>
                                <span className="text-[11px] font-mono text-zinc-400">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={`h-full ${amountLeft <= 0 ? "bg-emerald-400" : "bg-white"}`}
                                />
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 text-zinc-400">
                                        <ShoppingBag className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-base font-bold font-display text-white uppercase tracking-wider mb-2">
                                        Sua sacola está vazia
                                    </h3>
                                    <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                                        Explore nossos lançamentos e eleve seu guarda-roupa com o padrão MARQUEZ.
                                    </p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-semibold text-white"
                                    >
                                        Explorar Coleção
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={`${item.product.id}-${item.size}`}
                                            className="flex gap-4 p-3 bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all"
                                        >
                                            {/* Product Image */}
                                            <div className="w-20 h-28 bg-zinc-900 flex-shrink-0 relative overflow-hidden border border-white/10">
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1 font-display">
                                                            {item.product.name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.product.id, item.size)}
                                                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                                                            title="Remover item"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5">
                                                            TAM: {item.size}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400">
                                                            R$ {(item.product.promotionalPrice || item.product.price).toFixed(2).replace('.', ',')} un.
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center border border-white/15 bg-black/40">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                                            aria-label="Diminuir quantidade"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-mono font-medium text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                                            aria-label="Aumentar quantidade"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-semibold font-mono text-white text-sm">
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
                            <div className="border-t border-white/10 p-6 bg-zinc-950">
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span>Subtotal</span>
                                        <span className="font-mono text-white">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                        <span>Frete</span>
                                        <span className="font-mono text-zinc-400">
                                            {amountLeft <= 0 ? (
                                                <span className="text-emerald-400 font-semibold uppercase">Grátis</span>
                                            ) : (
                                                "Calculado no checkout"
                                            )}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex items-center justify-between text-white">
                                        <span className="text-sm font-bold uppercase tracking-wider font-display">Total Previsto</span>
                                        <span className="text-lg font-bold font-mono">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-white text-black font-bold uppercase tracking-[0.18em] py-4 text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
                                >
                                    Finalizar Pedido <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-[10px] text-zinc-400 text-center mt-3 uppercase tracking-wider">
                                    Checkout seguro via Pix e WhatsApp
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

