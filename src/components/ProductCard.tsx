"use client";

import { Product } from "@/lib/data";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    // For the prototype, we add the first available size to the cart directly if clicked here, 
    // or user goes to detail page to choose. Let's make the quick add just pick the first size 
    // or redirect to detail page. The prompt asks for an Add to Cart button on hover.
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.sizes.length > 0) {
            addToCart(product, product.sizes[0], 1);
        }
    };

    return (
        <Link href={`/produto/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] bg-[#121212] overflow-hidden mb-4">
                {/* Images */}
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                />
                {product.images[1] && (
                    <img
                        src={product.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
                    />
                )}

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.newProduct && (
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            New
                        </span>
                    )}
                    {product.promotionalPrice && (
                        <span className="bg-[#1C1C1C] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            Sale
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={handleQuickAdd}
                        className="w-full bg-white text-black font-semibold py-3 flex items-center justify-center gap-2 uppercase tracking-wider text-xs hover:bg-[#E5E5E5]"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Adicionar (+{product.sizes[0]})
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-1 group-hover:text-[#BFC0C2] transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-sm">
                    {product.promotionalPrice ? (
                        <>
                            <span className="text-[#BFC0C2] line-through">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-white font-medium">R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}</span>
                        </>
                    ) : (
                        <span className="text-white font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    )}
                </div>
                <div className="mt-3 flex gap-2">
                    {product.sizes.map((size) => (
                        <span key={size} className="text-[10px] text-[#BFC0C2] border border-[#1C1C1C] px-2 md:px-1.5 py-0.5 min-w-[24px] text-center">
                            {size}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
