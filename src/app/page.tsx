"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4);
  const categoryImages: Record<string, string> = {
    "camisetas": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    "calças": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    "conjuntos": "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=600&q=80",
    "moletons": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    "jaquetas": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    "acessórios": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80"
  };

  return (
    <div className="flex flex-col w-full">

      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[#080808]">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=80" alt="Masculine Fashion" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 flex flex-col items-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.1em] text-white uppercase mb-6"
          >
            MARQUEZ
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p className="text-lg md:text-xl text-[#BFC0C2] tracking-widest uppercase mb-12">
              ESTILO NÃO SE EXPLICA.<br />
              SE VESTE.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/loja"
                className="w-full sm:w-auto bg-white text-black px-12 py-4 font-semibold uppercase tracking-widest text-sm hover:bg-[#E5E5E5] transition-colors"
              >
                VER COLEÇÃO
              </Link>
              <Link
                href="/sobre"
                className="w-full sm:w-auto border border-white/30 text-white px-12 py-4 font-semibold uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white transition-all"
              >
                CONHECER A MARCA
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORIES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.slice(0, 6).map((category, index) => (
            <Link
              key={category}
              href={`/loja?categoria=${category.toLowerCase()}`}
              className="group relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden bg-[#121212]"
            >
              {/* Image */}
              <img
                src={categoryImages[category.toLowerCase()] || ""}
                alt={category}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-bold tracking-widest text-white uppercase mb-4">{category}</h3>
                <span className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-white opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  EXPLORAR <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[#1C1C1C]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-[0.15em] text-white uppercase">DESTAQUES</h2>
            <h2 className="text-3xl font-bold tracking-[0.15em] text-white uppercase">MARQUEZ</h2>
          </div>
          <Link href="/loja" className="text-sm font-medium tracking-widest text-[#BFC0C2] hover:text-white uppercase flex items-center gap-2 transition-colors">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
