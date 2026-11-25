"use client";

import { Product, Size, getFinalPrice, getDiscountPercent } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatInstallment, formatPrice } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
    const { addToCart, setIsCartOpen, getRemainingStock } = useCart();
    const [addedSize, setAddedSize] = useState<Size | null>(null);

    const isSoldOut = product.stock <= 0;
    const remaining = getRemainingStock(product);
    const finalPrice = getFinalPrice(product);
    const discount = getDiscountPercent(product);

    const handleSelectSize = (e: React.MouseEvent, size: Size) => {
        e.preventDefault();
        e.stopPropagation();
        const result = addToCart(product, size, 1);
        if (!result.ok) return;
        setAddedSize(size);
        setTimeout(() => {
            setAddedSize(null);
            setIsCartOpen(true);
        }, 400);
    };

    return (
        <Link href={`/produto/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] bg-[#111114] border border-white/5 overflow-hidden mb-4 transition-all duration-500 group-hover:border-white/20">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${product.images[1] ? "group-hover:opacity-0" : ""} ${isSoldOut ? "grayscale opacity-60" : ""}`}
                />
                {product.images[1] && (
                    <img
                        src={product.images[1]}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100 scale-105"
                    />
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {isSoldOut && (
                        <span className="bg-zinc-800 text-zinc-200 text-[9px] font-bold px-2 py-0.5 uppercase tracking-[0.2em]">Esgotado</span>
                    )}
                    {!isSoldOut && product.newProduct && (
                        <span className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-[0.2em]">Novo</span>
                    )}
                    {!isSoldOut && discount && (
                        <span className="bg-white text-black text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-[0.2em]">-{discount}%</span>
                    )}
                </div>

                {/* Compra rápida (desktop, ao passar o mouse) */}
                {!isSoldOut && remaining > 0 && (
                    <div className="hidden md:block absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-300 z-20">
                        <div className="bg-[#111114]/95 backdrop-blur-md border border-white/15 p-2.5 shadow-2xl">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-semibold flex items-center gap-1.5 mb-2">
                                <ShoppingBag className="w-3 h-3 text-white" />
                                Compra rápida
                            </span>
                            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5">
                                {product.sizes.map((size) => {
                                    const isJustAdded = addedSize === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={(e) => handleSelectSize(e, size)}
                                            className={`min-w-[32px] h-8 px-2 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center border ${
                                                isJustAdded
                                                    ? "bg-emerald-400 text-black border-emerald-400 scale-105"
                                                    : "bg-black/50 text-white border-white/15 hover:bg-white hover:text-black hover:border-white"
                                            }`}
                                            aria-label={`Adicionar ${product.name} tamanho ${size} à sacola`}
                                        >
                                            {isJustAdded ? <Check className="w-3 h-3 stroke-[3]" /> : size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-1 group-hover:text-zinc-300 transition-colors line-clamp-1 font-display">
                    {product.name}
                </h3>
                <div className="flex flex-wrap items-baseline gap-x-2.5 mt-1.5 text-sm">
                    {product.promotionalPrice && (
                        <span className="text-zinc-500 line-through text-xs font-mono">{formatPrice(product.price)}</span>
                    )}
                    <span className="text-white font-semibold font-mono">{formatPrice(finalPrice)}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 tracking-wide">
                    {isSoldOut ? "Indisponível no momento" : `em até ${formatInstallment(finalPrice)} sem juros`}
                </p>
            </div>
        </Link>
    );
}
