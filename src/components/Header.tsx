"use client";

import { useCart } from "@/lib/CartContext";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORE } from "@/lib/store";

const NAV = [
    { href: "/", label: "Início" },
    { href: "/loja", label: "Loja" },
    { href: "/loja?novidades=1", label: "Novidades" },
    { href: "/loja?categoria=camisetas", label: "Camisetas" },
    { href: "/loja?categoria=calcas", label: "Calças" },
    { href: "/sobre", label: "Quem Somos" },
];

export function Header() {
    const { itemCount, setIsCartOpen } = useCart();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileMenuOpen]);

    // Fundo sólido fora da home: o topo das outras páginas não tem foto escura por trás.
    const solid = isScrolled || pathname !== "/";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                solid ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
            }`}
        >
            <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-black px-3 py-2 text-xs z-50">
                Pular para o conteúdo
            </a>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex-1 xl:hidden">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2 -ml-2" aria-label="Abrir menu" aria-expanded={mobileMenuOpen}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 xl:flex-none flex justify-center xl:justify-start">
                    <Link href="/" className="inline-block" aria-label="MARQUEZ — página inicial">
                        <img src="/logo-dark.png" alt="MARQUEZ" className="h-11 md:h-12 w-auto rounded-full" />
                    </Link>
                </div>

                <nav aria-label="Menu principal" className="hidden xl:flex flex-1 justify-center gap-8 whitespace-nowrap text-xs font-medium tracking-widest text-[#BFC0C2] uppercase">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`hover:text-white transition-colors ${pathname === item.href ? "text-white" : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex-1 flex justify-end items-center gap-4 md:gap-6 text-white">
                    <Link href="/loja" className="hidden sm:block hover:text-[#BFC0C2] transition-colors" aria-label="Buscar produtos">
                        <Search className="w-5 h-5" />
                    </Link>
                    <button
                        className="relative hover:text-[#BFC0C2] transition-colors p-2 -mr-2"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Abrir sacola (${itemCount} ${itemCount === 1 ? "item" : "itens"})`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-black bg-white rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 xl:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu"
                            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-[#080808] z-50 border-r border-[#1C1C1C] flex flex-col xl:hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[#1C1C1C]">
                                <img src="/logo-dark.png" alt="MARQUEZ" className="h-9 w-auto rounded-full" />
                                <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2" aria-label="Fechar menu">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav aria-label="Menu" className="flex flex-col py-6 px-4 gap-2 text-base font-medium tracking-widest uppercase">
                                {NAV.map((item) => (
                                    <Link
                                        key={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        href={item.href}
                                        className="px-4 py-3 hover:bg-[#1C1C1C] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <p className="mt-auto p-6 text-[11px] text-zinc-500 tracking-widest uppercase border-t border-[#1C1C1C]">
                                Atendimento: {STORE.whatsappDisplay}
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
