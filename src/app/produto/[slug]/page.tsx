"use client";

import { use, useState } from "react";
import { MOCK_PRODUCTS, Size } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, Check, ChevronDown, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeGuideModal } from "@/components/SizeGuideModal";

export default function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
    const unwrappedParams = use(params);
    const product = MOCK_PRODUCTS.find(p => p.slug === unwrappedParams.slug);

    if (!product) {
        notFound();
    }

    const { addToCart, setIsCartOpen } = useCart();
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSizeError, setShowSizeError] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isAddedSuccess, setIsAddedSuccess] = useState(false);

    // Shipping simulation
    const [cep, setCep] = useState("");
    const [shippingResult, setShippingResult] = useState<string | null>(null);

    const relatedProducts = MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

    // Accordions
    const [openAccordion, setOpenAccordion] = useState<string | null>("composicao");

    const toggleAccordion = (id: string) => {
        setOpenAccordion(prev => prev === id ? null : id);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setShowSizeError(true);
            return;
        }
        setShowSizeError(false);
        addToCart(product, selectedSize, 1);
        setIsAddedSuccess(true);
        setTimeout(() => {
            setIsAddedSuccess(false);
            setIsCartOpen(true);
        }, 600);
    };

    const finalPrice = product.promotionalPrice || product.price;

    return (
        <div className="pt-28 lg:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <Link
                href="/loja"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white uppercase tracking-widest mb-8 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Loja
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Left: Image Gallery */}
                <div className="w-full lg:w-3/5 flex flex-col gap-4">
                    <div className="relative aspect-[3/4] bg-[#111114] border border-white/5 overflow-hidden w-full group">
                        {/* Main Image */}
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Navigation Arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-20 h-28 flex-shrink-0 bg-[#111114] border transition-all ${
                                        currentImageIndex === idx
                                            ? "border-white opacity-100 ring-1 ring-white"
                                            : "border-white/10 opacity-50 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img} alt={`${product.name} miniatura ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="border-b border-white/10 pb-6 mb-6">
                        <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2 block">
                            Categoria / {product.category}
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-wider text-white uppercase mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-3 text-2xl">
                            {product.promotionalPrice ? (
                                <>
                                    <span className="text-zinc-500 line-through text-lg font-mono">
                                        R$ {product.price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-white font-bold font-mono">
                                        R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="bg-white text-black text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest ml-2">
                                        Sale
                                    </span>
                                </>
                            ) : (
                                <span className="text-white font-bold font-mono">
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-zinc-400 mt-2 tracking-wide">
                            em até 3x de R$ {(finalPrice / 3).toFixed(2).replace('.', ',')} sem juros no cartão
                        </p>
                    </div>

                    <div className="mb-8">
                        <p className="text-zinc-300 text-sm leading-relaxed tracking-wide">
                            {product.description}
                        </p>
                    </div>

                    {/* Model Info */}
                    <div className="mb-6 flex items-center gap-3 p-3.5 bg-zinc-900/30 border border-white/5 text-xs text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0"></span>
                        <p className="leading-relaxed">
                            O modelo mede 1,82m, pesa 78kg e veste tamanho <strong className="text-white font-semibold">G</strong>.
                        </p>
                    </div>

                    {/* Sizes */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-white">
                                Selecione o Tamanho
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsSizeGuideOpen(true)}
                                className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider underline underline-offset-4"
                            >
                                <Ruler className="w-3.5 h-3.5" /> Guia de Medidas
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setShowSizeError(false);
                                    }}
                                    className={`w-12 h-12 text-xs font-semibold tracking-wider transition-all flex items-center justify-center border ${
                                        selectedSize === size
                                            ? "border-white bg-white text-black font-bold scale-105 shadow-lg"
                                            : "border-white/15 bg-zinc-900/50 text-zinc-300 hover:border-white hover:text-white"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* Inline validation message */}
                        {showSizeError && (
                            <div className="mt-3 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs tracking-wider uppercase animate-pulse flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                Selecione um tamanho antes de prosseguir com o pedido.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                                isAddedSuccess
                                    ? "bg-emerald-400 text-black border border-emerald-400"
                                    : "bg-white text-black hover:bg-zinc-200"
                            }`}
                        >
                            {isAddedSuccess ? (
                                <>
                                    <Check className="w-4 h-4 stroke-[3]" /> Adicionado à Sacola!
                                </>
                            ) : (
                                "Adicionar à Sacola"
                            )}
                        </button>

                        <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-400">
                            <div className="flex items-center gap-2 p-2.5 bg-zinc-900/40 border border-white/5">
                                <Truck className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                                <span>Envio expresso para todo Brasil</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-zinc-900/40 border border-white/5">
                                <RotateCcw className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                                <span>Primeira troca grátis em até 30 dias</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Calculator */}
                    <div className="mt-8 border border-white/10 p-5 bg-[#111114]">
                        <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Calcular Frete e Prazo</h3>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="00000-000" 
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                className="flex-1 bg-transparent border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                            />
                            <button 
                                onClick={() => {
                                    if(cep.length >= 8) setShippingResult("Frete Expresso: R$ 14,90 (2-4 dias úteis)");
                                    else setShippingResult(null);
                                }}
                                className="px-5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                            >
                                Ok
                            </button>
                        </div>
                        {shippingResult && (
                            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-zinc-300">
                                <span className="text-emerald-400 font-semibold block mb-1">✓ Entrega disponível</span>
                                {shippingResult}
                            </div>
                        )}
                        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-[10px] text-zinc-500 hover:text-zinc-300 underline underline-offset-4 mt-3 inline-block transition-colors">
                            Não sei meu CEP
                        </a>
                    </div>

                    {/* Functional Accordions */}
                    <div className="mt-10 border-t border-white/10 divide-y divide-white/10">
                        {/* Composição */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleAccordion("composicao")}
                                className="w-full py-4 text-xs font-semibold text-white uppercase tracking-widest flex justify-between items-center hover:text-zinc-300 transition-colors"
                            >
                                Composição e Detalhes
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === "composicao" ? "rotate-180" : ""}`} />
                            </button>
                            {openAccordion === "composicao" && (
                                <div className="pb-4 text-xs text-zinc-400 leading-relaxed space-y-1.5">
                                    <p>• 100% Algodão Premium Penteado com gramatura pesada (240g/m²).</p>
                                    <p>• Gola canelada de 3cm com pesponto duplo reforçado.</p>
                                    <p>• Toque peletizado com pré-encolhimento industrial.</p>
                                </div>
                            )}
                        </div>

                        {/* Cuidados */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleAccordion("cuidados")}
                                className="w-full py-4 text-xs font-semibold text-white uppercase tracking-widest flex justify-between items-center hover:text-zinc-300 transition-colors"
                            >
                                Cuidados de Lavagem
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === "cuidados" ? "rotate-180" : ""}`} />
                            </button>
                            {openAccordion === "cuidados" && (
                                <div className="pb-4 text-xs text-zinc-400 leading-relaxed space-y-1.5">
                                    <p>• Lavar à mão ou ciclo delicado com água fria.</p>
                                    <p>• Não utilizar alvejante ou produtos à base de cloro.</p>
                                    <p>• Secar à sombra e passar pelo avesso em temperatura média.</p>
                                </div>
                            )}
                        </div>

                        {/* Autenticidade */}
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleAccordion("autenticidade")}
                                className="w-full py-4 text-xs font-semibold text-white uppercase tracking-widest flex justify-between items-center hover:text-zinc-300 transition-colors"
                            >
                                Autenticidade e Garantia
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === "autenticidade" ? "rotate-180" : ""}`} />
                            </button>
                            {openAccordion === "autenticidade" && (
                                <div className="pb-4 text-xs text-zinc-400 leading-relaxed space-y-1.5">
                                    <p>• Produto 100% original MARQUEZ acompanhado de tag de lote exclusivo.</p>
                                    <p>• Garantia contra qualquer defeito de fabricação.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-24 pt-16 border-t border-white/10">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider mb-10 text-center">
                        Complete o Look
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((relProduct) => (
                            <Link href={`/produto/${relProduct.slug}`} key={relProduct.id} className="group flex flex-col">
                                <div className="relative aspect-[3/4] bg-[#111114] border border-white/5 overflow-hidden mb-4">
                                    <img 
                                        src={relProduct.images[0]} 
                                        alt={relProduct.name} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-sm text-white font-medium mb-1 truncate tracking-wide">{relProduct.name}</h3>
                                <p className="text-xs text-zinc-400 font-mono">R$ {relProduct.price.toFixed(2).replace('.', ',')}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Sticky Mobile Add To Cart Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 p-4 lg:hidden flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 tracking-widest uppercase truncate max-w-[140px]">{product.name}</span>
                    <span className="text-sm font-bold text-white font-mono">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                    onClick={() => {
                        handleAddToCart();
                        if (!selectedSize) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${
                        isAddedSuccess
                            ? "bg-emerald-400 text-black"
                            : "bg-white text-black"
                    }`}
                >
                    {isAddedSuccess ? "Na Sacola" : "Comprar"}
                </button>
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                category={product.category}
            />
        </div>
    );
}

