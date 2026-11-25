"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { whatsappUrl } from "@/lib/store";

export function WhatsAppFloat() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // No checkout o botão principal já é o WhatsApp.
    if (pathname === "/checkout") return null;

    // Na página de produto, some no celular: a barra fixa de compra ocupa o rodapé da tela.
    const offset = pathname.startsWith("/produto/") ? "hidden lg:block bottom-6" : "bottom-6";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className={`fixed ${offset} right-6 z-40 group`}
                >
                    <a
                        href={whatsappUrl("Olá! Vim pelo site da MARQUEZ e gostaria de conhecer os produtos.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center relative hover:bg-[#E5E5E5]"
                        aria-label="Fale conosco no WhatsApp"
                    >
                        <MessageCircle className="w-7 h-7" />
                        <span className="absolute right-full mr-4 bg-[#121212] text-white text-sm whitespace-nowrap px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Fale conosco
                        </span>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
