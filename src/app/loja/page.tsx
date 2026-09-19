"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/data";

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
            result = result.filter(p => p.sizes.includes(filterSize as any));
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
                <h2 className="text-xl font-bold tracking-[0.15em] text-white uppercase mb-8">CATÁLOGO</h2>

                <div className="space-y-8">
                    {/* Categoria */}
                    <div>
                        <h3 className="text-sm font-medium tracking-widest text-white uppercase mb-4">CATEGORIA</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-sm text-[#BFC0C2] hover:text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="categoria"
                                    checked={filterCategory === ""}
                                    onChange={() => setFilterCategory("")}
                                    className="bg-black border-[#1C1C1C] checked:bg-white text-black focus:ring-0 focus:ring-offset-0"
                                />
                                Todas
                            </label>
                            {CATEGORIES.map(cat => (
                                <label key={cat} className="flex items-center gap-3 text-sm text-[#BFC0C2] hover:text-white cursor-pointer">
                                    <input
                                        type="radio"
                                        name="categoria"
                                        checked={filterCategory.toLowerCase() === cat.toLowerCase()}
                                        onChange={() => setFilterCategory(cat.toLowerCase())}
                                        className="bg-black border-[#1C1C1C] checked:bg-white text-black focus:ring-0 focus:ring-offset-0"
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tamanho */}
                    <div>
                        <h3 className="text-sm font-medium tracking-widest text-white uppercase mb-4">TAMANHO</h3>
                        <div className="flex flex-wrap gap-2">
                            {["P", "M", "G", "GG", "XG", "U"].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setFilterSize(filterSize === size ? "" : size)}
                                    className={`w-10 h-10 border text-xs flex items-center justify-center transition-colors ${filterSize === size
                                            ? "border-white bg-white text-black font-bold"
                                            : "border-[#1C1C1C] text-[#BFC0C2] hover:border-white hover:text-white"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">

                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-[#1C1C1C]">
                    <p className="text-sm tracking-wide text-[#BFC0C2]">
                        Exibindo {filteredProducts.length} produtos
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-widest text-[#BFC0C2]">Ordenar por:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-black border border-[#1C1C1C] text-white text-sm py-2 px-3 focus:outline-none focus:border-white cursor-pointer"
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-lg text-[#BFC0C2] tracking-wide mb-6">Nenhum produto encontrado com estes filtros.</p>
                        <button
                            onClick={() => { setFilterCategory(""); setFilterSize(""); }}
                            className="border border-white/20 px-8 py-3 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
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
