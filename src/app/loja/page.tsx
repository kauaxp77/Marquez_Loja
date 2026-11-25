"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ALL_SIZES, CATEGORIES, MOCK_PRODUCTS, Size, getFinalPrice } from "@/lib/data";
import { slugify } from "@/lib/store";

const SORT_OPTIONS = [
    { value: "recentes", label: "Novidades" },
    { value: "menor-preco", label: "Menor preço" },
    { value: "maior-preco", label: "Maior preço" },
] as const;

const chip = (active: boolean) =>
    `w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-all flex items-center justify-between border ${
        active
            ? "bg-white text-black font-bold border-white"
            : "bg-zinc-900/30 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
    }`;

function LojaContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Os filtros vivem na URL: o link do menu funciona mesmo já estando na loja e a busca pode ser compartilhada.
    const category = searchParams.get("categoria") ?? "";
    const size = (searchParams.get("tamanho") ?? "") as Size | "";
    const onlyNew = searchParams.get("novidades") === "1";
    const query = searchParams.get("busca") ?? "";
    const sortParam = searchParams.get("ordem");
    const sortBy = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam! : "recentes";

    const setParam = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    const clearFilters = () => router.replace(pathname, { scroll: false });

    const filteredProducts = useMemo(() => {
        const q = slugify(query);
        const result = MOCK_PRODUCTS.filter(
            (p) =>
                (!category || slugify(p.category) === category) &&
                (!size || p.sizes.includes(size)) &&
                (!onlyNew || p.newProduct) &&
                (!q || slugify(`${p.name} ${p.category} ${p.description}`).includes(q))
        );

        result.sort((a, b) => {
            // Esgotados sempre por último.
            if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1;
            if (sortBy === "menor-preco") return getFinalPrice(a) - getFinalPrice(b);
            if (sortBy === "maior-preco") return getFinalPrice(b) - getFinalPrice(a);
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return result;
    }, [category, size, onlyNew, query, sortBy]);

    const activeCount = [category, size, onlyNew, query].filter(Boolean).length;
    const currentCategory = CATEGORIES.find((c) => slugify(c) === category);

    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Filtros */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="border-b border-white/10 pb-4 mb-6 flex items-end justify-between">
                    <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-1">Catálogo</span>
                        <h1 className="text-xl font-bold font-display tracking-wider text-white uppercase">
                            {currentCategory ?? (onlyNew ? "Novidades" : "Toda a Loja")}
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((o) => !o)}
                        aria-expanded={filtersOpen}
                        aria-controls="filtros"
                        className="md:hidden flex items-center gap-2 border border-white/15 px-3 py-2 text-[11px] uppercase tracking-widest text-white"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
                    </button>
                </div>

                {/* Busca */}
                <div className="relative mb-6">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setParam({ busca: e.target.value || null })}
                        placeholder="Buscar peça..."
                        aria-label="Buscar produto"
                        className="w-full bg-zinc-900/60 border border-white/10 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                </div>

                <div id="filtros" className={`space-y-8 ${filtersOpen ? "block" : "hidden"} md:block`}>
                    <div>
                        <h2 className="text-xs font-semibold tracking-widest text-white uppercase mb-3.5">Categoria</h2>
                        <div className="space-y-2">
                            <button type="button" onClick={() => setParam({ categoria: null })} className={chip(category === "")}>
                                Todas
                            </button>
                            {CATEGORIES.map((cat) => {
                                const slug = slugify(cat);
                                const isSelected = category === slug;
                                const count = MOCK_PRODUCTS.filter((p) => p.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setParam({ categoria: isSelected ? null : slug })}
                                        className={chip(isSelected)}
                                        aria-pressed={isSelected}
                                    >
                                        {cat}
                                        <span className="font-mono text-[10px] opacity-60">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-semibold tracking-widest text-white uppercase mb-3.5">Tamanho</h2>
                        <div className="flex flex-wrap gap-2">
                            {ALL_SIZES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setParam({ tamanho: size === s ? null : s })}
                                    aria-pressed={size === s}
                                    className={`w-10 h-10 border text-xs font-semibold flex items-center justify-center transition-all ${
                                        size === s
                                            ? "border-white bg-white text-black font-bold scale-105"
                                            : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={onlyNew}
                            onChange={(e) => setParam({ novidades: e.target.checked ? "1" : null })}
                            className="w-4 h-4 accent-white"
                        />
                        Somente novidades
                    </label>

                    {activeCount > 0 && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="w-full py-2.5 text-[11px] uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-3.5 h-3.5" /> Limpar Filtros
                        </button>
                    )}
                </div>
            </aside>

            {/* Lista */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-white/10">
                    <p className="text-xs font-mono tracking-wide text-zinc-400" aria-live="polite">
                        Exibindo <strong className="text-white">{filteredProducts.length}</strong>{" "}
                        {filteredProducts.length === 1 ? "produto" : "produtos"}
                    </p>
                    <div className="flex items-center gap-3">
                        <label htmlFor="ordem" className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
                            Ordenar por:
                        </label>
                        <select
                            id="ordem"
                            value={sortBy}
                            onChange={(e) => setParam({ ordem: e.target.value === "recentes" ? null : e.target.value })}
                            className="bg-zinc-900 border border-white/15 text-white text-xs py-2 px-3 focus:outline-none focus:border-white cursor-pointer uppercase tracking-wider"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-zinc-900/20 border border-white/5 p-8">
                        <p className="text-sm text-zinc-400 tracking-wide mb-6">Nenhum produto encontrado com estes filtros.</p>
                        <button
                            onClick={clearFilters}
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
        <Suspense fallback={<div className="pt-32 pb-24 px-4 text-center text-zinc-400 text-xs uppercase tracking-widest">Carregando catálogo...</div>}>
            <LojaContent />
        </Suspense>
    );
}
