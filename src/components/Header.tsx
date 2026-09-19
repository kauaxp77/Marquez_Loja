"use client";

import { useCart } from "@/lib/CartContext";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const { itemCount, setIsCartOpen } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                {/* Mobile Menu Button */}
                <div className="flex-1 md:hidden">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2 -ml-2">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Logo */}
                <div className="flex-1 md:flex-none text-center md:text-left flex justify-center md:justify-start">
                    <Link href="/" className="inline-block">
                        <img src="/logo.jpeg" alt="MARQUEZ Logo" className="h-10 md:h-12 w-auto invert-0 dark:invert" />
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-medium tracking-widest text-[#BFC0C2]">
                    <Link href="/" className="hover:text-white transition-colors">INÍCIO</Link>
                    <Link href="/loja" className="hover:text-white transition-colors">LOJA</Link>
                    <Link href="/loja?categoria=camisetas" className="hover:text-white transition-colors">CAMISETAS</Link>
                    <Link href="/loja?categoria=calcas" className="hover:text-white transition-colors">CALÇAS</Link>
                </nav>

                {/* Actions */}
                <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6 text-white">
                    <button className="hidden sm:block hover:text-[#BFC0C2] transition-colors"><Search className="w-5 h-5" /></button>
                    <button className="hidden sm:block hover:text-[#BFC0C2] transition-colors"><User className="w-5 h-5" /></button>
                    <button
                        className="relative hover:text-[#BFC0C2] transition-colors p-2 -mr-2"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-black bg-white rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-[#080808] z-50 border-r border-[#1C1C1C] flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[#1C1C1C]">
                                <img src="/logo.jpeg" alt="MARQUEZ Logo" className="h-8 w-auto invert-0 dark:invert" />
                                <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex flex-col py-6 px-4 space-y-6 text-lg font-medium tracking-wide">
                                <Link onClick={() => setMobileMenuOpen(false)} href="/" className="px-4 py-2 hover:bg-[#1C1C1C] rounded transition-colors">INÍCIO</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} href="/loja" className="px-4 py-2 hover:bg-[#1C1C1C] rounded transition-colors">LOJA</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} href="/loja?categoria=camisetas" className="px-4 py-2 hover:bg-[#1C1C1C] rounded transition-colors">CAMISETAS</Link>
                                <Link onClick={() => setMobileMenuOpen(false)} href="/loja?categoria=calcas" className="px-4 py-2 hover:bg-[#1C1C1C] rounded transition-colors">CALÇAS</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
