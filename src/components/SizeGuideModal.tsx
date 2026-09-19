"use client";

import { useEffect, useState } from "react";
import { X, Ruler, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export function SizeGuideModal({ isOpen, onClose, category = "camisetas" }: SizeGuideModalProps) {
  const isLowerBody = ["calças", "calcas", "bermudas"].includes(category.toLowerCase());
  const [selectedTab, setSelectedTab] = useState<"superior" | "inferior" | null>(null);

  // Tab atual prioriza seleção manual, senão infere pela categoria
  const activeTab = selectedTab ?? (isLowerBody ? "inferior" : "superior");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const upperSizes = [
    { size: "P", chest: "104 - 108", length: "72", sleeve: "22", recommended: "1.65m - 1.74m | 60 - 70kg" },
    { size: "M", chest: "110 - 114", length: "74", sleeve: "23", recommended: "1.72m - 1.80m | 70 - 80kg" },
    { size: "G", chest: "116 - 120", length: "76", sleeve: "24", recommended: "1.78m - 1.86m | 80 - 90kg" },
    { size: "GG", chest: "122 - 126", length: "78", sleeve: "25", recommended: "1.84m - 1.92m | 90 - 102kg" },
    { size: "XG", chest: "128 - 134", length: "80", sleeve: "26", recommended: "1.88m+ | 100kg+" },
  ];

  const lowerSizes = [
    { size: "P", waist: "76 - 80", hip: "98 - 102", length: "102", recommended: "Tamanho 38 - 40" },
    { size: "M", waist: "82 - 86", hip: "104 - 108", length: "104", recommended: "Tamanho 40 - 42" },
    { size: "G", waist: "88 - 92", hip: "110 - 114", length: "106", recommended: "Tamanho 42 - 44" },
    { size: "GG", waist: "94 - 100", hip: "116 - 122", length: "108", recommended: "Tamanho 46 - 48" },
    { size: "XG", waist: "102 - 108", hip: "124 - 130", length: "110", recommended: "Tamanho 48 - 50" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#111114] border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs tracking-widest text-zinc-400 uppercase mb-1">
                  <Ruler className="w-3.5 h-3.5 text-white" />
                  Guia Oficial de Caimento
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wider text-white uppercase">
                  Tabela de Medidas MARQUEZ
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Fechar guia de tamanhos"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 border-b border-white/10 pb-3">
              <button
                onClick={() => setSelectedTab("superior")}
                className={`text-xs uppercase tracking-widest px-4 py-2 font-medium transition-all ${
                  activeTab === "superior"
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Parte Superior (Camisetas / Moletons)
              </button>
              <button
                onClick={() => setSelectedTab("inferior")}
                className={`text-xs uppercase tracking-widest px-4 py-2 font-medium transition-all ${
                  activeTab === "inferior"
                    ? "bg-white text-black font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Parte Inferior (Calças)
              </button>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
              {activeTab === "superior" ? (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-widest font-mono text-[11px]">
                      <th className="py-3 px-2">Tam</th>
                      <th className="py-3 px-2">Tórax (cm)</th>
                      <th className="py-3 px-2">Comp. (cm)</th>
                      <th className="py-3 px-2">Manga (cm)</th>
                      <th className="py-3 px-2 hidden sm:table-cell">Indicação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {upperSizes.map((row) => (
                      <tr key={row.size} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-2 font-bold text-white">{row.size}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.chest}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.length}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.sleeve}</td>
                        <td className="py-3.5 px-2 text-zinc-400 text-xs hidden sm:table-cell">{row.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-widest font-mono text-[11px]">
                      <th className="py-3 px-2">Tam</th>
                      <th className="py-3 px-2">Cintura (cm)</th>
                      <th className="py-3 px-2">Quadril (cm)</th>
                      <th className="py-3 px-2">Comp. (cm)</th>
                      <th className="py-3 px-2">Manequim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {lowerSizes.map((row) => (
                      <tr key={row.size} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-2 font-bold text-white">{row.size}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.waist}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.hip}</td>
                        <td className="py-3.5 px-2 text-zinc-300">{row.length}</td>
                        <td className="py-3.5 px-2 text-zinc-400 text-xs">{row.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Measurement Tips */}
            <div className="mt-8 bg-zinc-900/60 border border-white/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                Caimento Streetwear Oversized
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Nossas peças têm modelagem premium com ombros levemente caídos. Se preferir um ajuste mais ajustado ao corpo (slim), recomendamos optar por um número abaixo do seu habitual.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
