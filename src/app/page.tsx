"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Gem, Shirt, ShieldCheck, CreditCard, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/data";
import { FREE_SHIPPING_THRESHOLD, formatPrice, slugify } from "@/lib/store";

const CATEGORY_IMAGES: Record<string, string> = {
    camisetas: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    calcas: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    conjuntos: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    moletons: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    jaquetas: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    acessorios: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
};

const PILLARS = [
    { Icon: Gem, title: "Alta Qualidade", text: "Materiais selecionados e acabamento impecável." },
    { Icon: Shirt, title: "Estilo Moderno", text: "Modelagens atuais para o dia a dia e a noite." },
    { Icon: ShieldCheck, title: "Compra Segura", text: "Pedido confirmado direto com a nossa equipe." },
    { Icon: CreditCard, title: "Pix ou Cartão", text: "Diversas formas de pagamento, cartão em até 3x." },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7 },
};

export default function Home() {
    const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured && p.stock > 0).slice(0, 4);
    const newProducts = MOCK_PRODUCTS.filter((p) => p.newProduct && p.stock > 0)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    return (
        <div className="flex flex-col w-full">
            {/* HERO */}
            <section className="relative h-[100svh] min-h-[560px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#080808]">
                    <img
                        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=80"
                        alt=""
                        fetchPriority="high"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/40 to-black/30 z-10" />
                </div>

                <div className="relative z-20 text-center px-4 flex flex-col items-center max-w-4xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-[10px] sm:text-xs text-zinc-300 tracking-[0.5em] uppercase mb-4"
                    >
                        Roupas Masculinas
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-[clamp(2rem,8.5vw,8rem)] leading-none font-extrabold font-display tracking-[0.12em] pl-[0.12em] text-white uppercase mb-6 drop-shadow-2xl"
                    >
                        MARQUEZ
                    </motion.h1>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="w-full">
                        <p className="text-sm md:text-lg text-zinc-300 font-light tracking-[0.15em] md:tracking-[0.25em] uppercase mb-12">
                            Qualidade que veste com atitude
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/loja"
                                className="w-full sm:w-auto bg-white text-black px-12 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all shadow-xl"
                            >
                                Ver Coleção
                            </Link>
                            <Link
                                href="/loja?novidades=1"
                                className="w-full sm:w-auto border border-white/30 backdrop-blur-md bg-black/40 text-white px-12 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
                            >
                                Lançamentos
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PILARES */}
            <section className="border-y border-white/10 bg-[#0c0c0f]">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
                    {PILLARS.map(({ Icon, title, text }) => (
                        <div key={title} className="flex flex-col items-center text-center gap-2 px-4 py-8">
                            <Icon className="w-6 h-6 text-zinc-200" strokeWidth={1.5} aria-hidden />
                            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">{title}</h2>
                            <p className="text-[11px] text-zinc-400 max-w-[200px] leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* DESTAQUES */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                    <div>
                        <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">Seleção Especial</span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-wider text-white uppercase">Destaques MARQUEZ</h2>
                    </div>
                    <Link href="/loja" className="text-xs font-semibold tracking-widest text-zinc-300 hover:text-white uppercase flex items-center gap-2 transition-colors">
                        Ver catálogo completo <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* CATEGORIAS */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10">
                <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block mb-2">Navegue por Segmento</span>
                    <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-wider text-white uppercase">Coleções MARQUEZ</h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {CATEGORIES.map((category) => {
                        const slug = slugify(category);
                        return (
                            <Link
                                key={category}
                                href={`/loja?categoria=${slug}`}
                                className="group relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-square overflow-hidden bg-[#111114] border border-white/5 hover:border-white/20 transition-all"
                            >
                                <img
                                    src={CATEGORY_IMAGES[slug]}
                                    alt=""
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-colors duration-500 group-hover:bg-black/40" />
                                <div className="absolute inset-0 flex flex-col items-center justify-end sm:justify-center p-4 sm:p-6 text-center">
                                    <h3 className="text-base sm:text-2xl font-bold font-display tracking-widest text-white uppercase mb-2">{category}</h3>
                                    <span className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-white opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                        EXPLORAR <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* NOVIDADES */}
            {newProducts.length > 0 && (
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10">
                    <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                        <div>
                            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">Acabou de Chegar</span>
                            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-wider text-white uppercase">Lançamentos</h2>
                        </div>
                        <Link href="/loja?novidades=1" className="text-xs font-semibold tracking-widest text-zinc-300 hover:text-white uppercase flex items-center gap-2 transition-colors">
                            Ver todos os lançamentos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
                        {newProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* QUEM SOMOS (resumo) */}
            <section className="border-t border-white/10 bg-[#0c0c0f]">
                <motion.div {...fadeUp} className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
                    <img src="/logo-dark.png" alt="" className="w-20 h-20 mx-auto mb-8 rounded-full" />
                    <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-wider text-white uppercase mb-6">
                        Mais que uma loja,<br className="sm:hidden" /> uma marca de confiança
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
                        A MARQUEZ é uma marca forte, feita para homens que buscam estilo, conforto e qualidade em cada detalhe.
                        Peças confeccionadas com materiais de alta qualidade, com durabilidade, caimento perfeito e um visual sempre impecável.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-zinc-300 mb-10">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4" aria-hidden /> Envio para todo o Brasil</span>
                        <span className="hidden sm:block w-px h-4 bg-white/20" aria-hidden />
                        <span>Frete grátis (PAC) acima de {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                    </div>
                    <Link
                        href="/sobre"
                        className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
                    >
                        Conheça a MARQUEZ <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
