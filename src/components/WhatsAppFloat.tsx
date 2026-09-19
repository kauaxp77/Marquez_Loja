"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppFloat() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after scrolling a bit
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        const text = encodeURIComponent("Olá! Vim pelo site da Marquez e gostaria de conhecer os produtos.");
        window.open(`https://wa.me/556191774178?text=${text}`, "_blank");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-6 right-6 z-40 group"
                >
                    <button
                        onClick={handleClick}
                        className="bg-white text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center relative hover:bg-[#E5E5E5]"
                        aria-label="Fale conosco no WhatsApp"
                    >
                        <MessageCircle className="w-7 h-7" />

                        {/* Tooltip */}
                        <span className="absolute right-full mr-4 bg-[#121212] text-white text-sm whitespace-nowrap px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Fale conosco
                        </span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
