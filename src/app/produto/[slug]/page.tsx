"use client";

import { use, useState } from "react";
import { MOCK_PRODUCTS, Size } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
    // Next 15 requires awaiting params
    const unwrappedParams = use(params);

    const product = MOCK_PRODUCTS.find(p => p.slug === unwrappedParams.slug);

    if (!product) {
        notFound();
    }

    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Por favor, selecione um tamanho.");
            return;
        }
        addToCart(product, selectedSize, 1);
    };

    return (
        <div className="pt-24 lg:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

            {/* Breadcrumb / Back */}
            <Link href="/loja" className="inline-flex items-center gap-2 text-sm text-[#BFC0C2] hover:text-white uppercase tracking-widest mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Voltar para Loja
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                {/* Left: Image Gallery */}
                <div className="w-full lg:w-3/5 flex flex-col gap-4">
                    <div className="relative aspect-[3/4] bg-[#121212] overflow-hidden w-full">
                        {/* Main Image */}
                        <img src={product.images[currentImageIndex]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />

                        {/* Arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-black transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-24 h-32 flex-shrink-0 bg-[#121212] ${currentImageIndex === idx ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100 transition-opacity'}`}
                                >
                                    <img src={img} alt={`${product.name} thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="border-b border-[#1C1C1C] pb-6 mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.1em] text-white uppercase mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 text-xl">
                            {product.promotionalPrice ? (
                                <>
                                    <span className="text-[#BFC0C2] line-through">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                                    <span className="text-white font-medium">R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}</span>
                                    <span className="bg-[#1C1C1C] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest ml-2">Sale</span>
                                </>
                            ) : (
                                <span className="text-white font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                            )}
                        </div>

                        {/* Installments info (simulated) */}
                        <p className="text-sm text-[#BFC0C2] mt-2 tracking-wide">
                            Em até 3x de R$ {((product.promotionalPrice || product.price) / 3).toFixed(2).replace('.', ',')} sem juros
                        </p>
                    </div>

                    <div className="mb-8">
                        <p className="text-[#BFC0C2] text-sm leading-relaxed tracking-wide">
                            {product.description}
                        </p>
                    </div>

                    {/* Sizes */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium uppercase tracking-widest text-white">Tamanho</span>
                            <button className="text-xs flex items-center gap-1 text-[#BFC0C2] hover:text-white transition-colors uppercase tracking-widest">
                                <Ruler className="w-4 h-4" /> Guia de tamanhos
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 border text-sm flex items-center justify-center transition-colors ${selectedSize === size
                                        ? "border-white bg-white text-black font-bold"
                                        : "border-[#1C1C1C] text-[#BFC0C2] hover:border-white hover:text-white"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {!selectedSize && (
                            <p className="text-red-500 text-xs mt-3 uppercase tracking-widest">
                                Selecione um tamanho para continuar
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center transition-colors ${selectedSize
                                ? "bg-white text-black hover:bg-[#E5E5E5]"
                                : "bg-[#1C1C1C] text-[#BFC0C2] cursor-not-allowed"
                                }`}
                        >
                            Adicionar à Sacola
                        </button>
                        <p className="text-center text-xs text-[#BFC0C2] mt-4 tracking-wide flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            Produto disponível. Envio imediato.
                        </p>
                    </div>

                    {/* Accordions (Simulated Details) */}
                    <div className="mt-12 border-t border-[#1C1C1C] pt-6 space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-white uppercase tracking-widest mb-2 flex justify-between items-center cursor-pointer">
                                Composição <Plus className="w-4 h-4" />
                            </h4>
                        </div>
                        <div className="border-t border-[#1C1C1C] pt-6">
                            <h4 className="text-sm font-medium text-white uppercase tracking-widest mb-2 flex justify-between items-center cursor-pointer">
                                Cuidados <Plus className="w-4 h-4" />
                            </h4>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
