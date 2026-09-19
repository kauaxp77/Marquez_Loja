"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS, Size } from "@/lib/data";

function LojaContent() {
    const searchParams = useSearchParams();
    const initCategory = searchParams.get("categoria") || "";

    const [filterCategory, setFilterCategory] = useState(initCategory);
    const [filterSize, setFilterSize] = useState("");
    const [sortBy, setSortBy] = useState("recentes");

    const filteredProducts = useMemo(() => {
        let result = [...MOCK_PRODUCTS];

        if (filterCategory) {
            result = result.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());
        }

        if (filterSize) {
            result = result.filter(p => p.sizes.includes(filterSize as Size));
        }

        if (sortBy === "menor-preco") {
            result.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
        } else if (sortBy === "maior-preco") {
            result.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
        } else if (sortBy === "recentes") {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return result;
    }, [filterCategory, filterSize, sortBy]);

    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-8 lg:gap-12">

            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="border-b border-white/10 pb-4 mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-1">
                        Filtros
                    </span>
                    <h2 className="text-xl font-bold font-display tracking-wider text-white uppercase">
                        Catálogo
                    </h2>
                </div>

                <div className="space-y-8">
                    {/* Categoria */}
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest text-white uppercase mb-3.5">
                            Categoria
                        </h3>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => setFilterCategory("")}
                                className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-all flex items-center justify-between border ${
                                    filterCategory === ""
                                        ? "bg-white text-black font-bold border-white"
                                        : "bg-zinc-900/30 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                Todas
                            </button>
                            {CATEGORIES.map(cat => {
                                const isSelected = filterCategory.toLowerCase() === cat.toLowerCase();
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFilterCategory(isSelected ? "" : cat.toLowerCase())}
                                        className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-all flex items-center justify-between border ${
                                            isSelected
                                                ? "bg-white text-black font-bold border-white"
                                                : "bg-zinc-900/30 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tamanho */}
                    <div>
                        <h3 className="text-xs font-semibold tracking-widest text-white uppercase mb-3.5">
                            Tamanho
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["P", "M", "G", "GG", "XG", "U"].map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setFilterSize(filterSize === size ? "" : size)}
                                    className={`w-10 h-10 border text-xs font-semibold flex items-center justify-center transition-all ${
                                        filterSize === size
                                            ? "border-white bg-white text-black font-bold scale-105"
                                            : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(filterCategory || filterSize) && (
                        <button
                            type="button"
                            onClick={() => { setFilterCategory(""); setFilterSize(""); }}
                            className="w-full py-2.5 text-[11px] uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">

                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-white/10">
                    <p className="text-xs font-mono tracking-wide text-zinc-400">
                        Exibindo <strong className="text-white">{filteredProducts.length}</strong> produtos
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">Ordenar por:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-zinc-900 border border-white/15 text-white text-xs py-2 px-3 focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider"
                        >
                            <option value="recentes">Mais recentes</option>
                            <option value="menor-preco">Menor preço</option>
                            <option value="maior-preco">Maior preço</option>
                            <option value="mais-vendidos">Mais vendidos</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-zinc-900/20 border border-white/5 p-8">
                        <p className="text-sm text-zinc-400 tracking-wide mb-6">Nenhum produto encontrado com estes filtros.</p>
                        <button
                            onClick={() => { setFilterCategory(""); setFilterSize(""); }}
                            className="border border-white/20 px-8 py-3 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-semibold"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function Loja() {
    return (
        <Suspense fallback={<div className="pt-32 pb-24 px-4 text-center text-white">Carregando catálogo...</div>}>
            <LojaContent />
        </Suspense>
    );
}
