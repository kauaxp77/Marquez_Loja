"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";

const InstagramIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

export function Footer() {
    return (
        <footer className="bg-black border-t border-[#1C1C1C] text-[#BFC0C2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Logo & Intro */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <img src="/logo.jpeg" alt="MARQUEZ Logo" className="h-12 w-auto invert-0 dark:invert" />
                        </Link>
                        <p className="text-sm tracking-wide leading-relaxed">
                            Estilo não se explica. Se veste.<br />
                            Moda masculina premium para o homem contemporâneo.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-medium tracking-widest uppercase mb-6 text-sm">MARQUEZ</h3>
                        <ul className="space-y-4 text-sm tracking-wide">
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre nós</Link></li>
                            <li><Link href="/loja" className="hover:text-white transition-colors">Loja</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                            <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de privacidade</Link></li>
                            <li><Link href="/termos" className="hover:text-white transition-colors">Termos</Link></li>
                            <li><Link href="/trocas" className="hover:text-white transition-colors">Trocas e devoluções</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2">
                        <h3 className="text-white font-medium tracking-widest uppercase mb-6 text-sm">ATENDIMENTO</h3>
                        <div className="space-y-4 text-sm tracking-wide">
                            <a
                                href="https://wa.me/556191774178"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 hover:text-white transition-colors"
                            >
                                <Smartphone className="w-5 h-5 text-white" />
                                (61) 9177-4178
                            </a>
                            <a
                                href="https://instagram.com/otl_marquez"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 hover:text-white transition-colors"
                            >
                                <InstagramIcon />
                                @otl_marquez
                            </a>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row justify-between items-center text-xs tracking-wider">
                    <p>© 2026 MARQUEZ. Todos os direitos reservados.</p>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <span className="opacity-50">Desenvolvido com excelência.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
