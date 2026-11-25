"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Ruler, Check, ChevronDown, Truck, RotateCcw, Minus, Plus, MessageCircle } from "lucide-react";
import { MOCK_PRODUCTS, Product, Size, getFinalPrice, getDiscountPercent } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { FREE_SHIPPING_THRESHOLD, formatInstallment, formatPrice, getShippingOptions, slugify, whatsappUrl } from "@/lib/store";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { ProductCard } from "@/components/ProductCard";

const LOW_STOCK = 5;

export function ProductView({ product }: { product: Product }) {
    const { addToCart, setIsCartOpen, getRemainingStock } = useCart();
    const [selectedSize, setSelectedSize] = useState<Size | null>(product.sizes.length === 1 ? product.sizes[0] : null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isAddedSuccess, setIsAddedSuccess] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>("composicao");
    const [cep, setCep] = useState("");
    const [showShipping, setShowShipping] = useState(false);

    const finalPrice = getFinalPrice(product);
    const discount = getDiscountPercent(product);
    const remaining = getRemainingStock(product);
    const isSoldOut = product.stock <= 0;
    const maxQty = Math.max(1, remaining);
    const qty = Math.min(quantity, maxQty);

    const relatedProducts = [
        ...MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category),
        ...MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category && p.stock > 0),
    ].slice(0, 4);

    const handleAddToCart = () => {
        if (isSoldOut) return;
        if (!selectedSize) {
            setMessage({ type: "error", text: "Selecione um tamanho antes de adicionar à sacola." });
            return;
        }
        const result = addToCart(product, selectedSize, qty);
        if (!result.ok) {
            setMessage({ type: "error", text: "Você já tem na sacola todas as unidades disponíveis desta peça." });
            return;
        }
        setMessage(
            result.added < qty
                ? { type: "info", text: `Só havia ${result.added} unidade(s) disponível(is). Adicionamos o máximo.` }
                : null
        );
        setQuantity(1);
        setIsAddedSuccess(true);
        setTimeout(() => {
            setIsAddedSuccess(false);
            setIsCartOpen(true);
        }, 600);
    };

    const handleCepChange = (value: string) => {
        let digits = value.replace(/\D/g, "").slice(0, 8);
        if (digits.length > 5) digits = `${digits.slice(0, 5)}-${digits.slice(5)}`;
        setCep(digits);
        setShowShipping(false);
    };

    const toggleAccordion = (id: string) => setOpenAccordion((prev) => (prev === id ? null : id));

    const prevImage = () => setCurrentImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1));
    const nextImage = () => setCurrentImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1));

    const accordions = [
        { id: "composicao", title: "Composição e Detalhes", items: product.details },
        {
            id: "cuidados",
            title: "Cuidados de Lavagem",
            items: [
                "Lavar à mão ou em ciclo delicado com água fria.",
                "Não utilizar alvejante ou produtos à base de cloro.",
                "Secar à sombra e passar pelo avesso em temperatura média.",
            ],
        },
        {
            id: "trocas",
            title: "Trocas e Garantia",
            items: [
                "Primeira troca grátis em até 30 dias após o recebimento.",
                "Arrependimento: devolução em até 7 dias (art. 49 do CDC).",
                "Garantia contra defeitos de fabricação.",
            ],
        },
    ];

    return (
        <div className="pt-28 lg:pt-36 pb-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Breadcrumb */}
            <nav aria-label="Navegação estrutural" className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-widest mb-8">
                <Link href="/" className="hover:text-white transition-colors">Início</Link>
                <span aria-hidden>/</span>
                <Link href="/loja" className="hover:text-white transition-colors">Loja</Link>
                <span aria-hidden>/</span>
                <Link href={`/loja?categoria=${slugify(product.category)}`} className="hover:text-white transition-colors">
                    {product.category}
                </Link>
                <span aria-hidden>/</span>
                <span className="text-zinc-300 truncate max-w-[180px] sm:max-w-none">{product.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Galeria */}
                <div className="w-full lg:w-3/5 flex flex-col gap-4">
                    <div className="relative aspect-[3/4] bg-[#111114] border border-white/5 overflow-hidden w-full group">
                        <img
                            src={product.images[currentImageIndex]}
                            alt={`${product.name} — foto ${currentImageIndex + 1} de ${product.images.length}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? "grayscale" : ""}`}
                        />
                        {(discount || isSoldOut) && (
                            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                                {isSoldOut && (
                                    <span className="bg-zinc-800 text-zinc-200 text-[10px] font-bold px-2.5 py-1 uppercase tracking-[0.2em]">Esgotado</span>
                                )}
                                {discount && !isSoldOut && (
                                    <span className="bg-white text-black text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-[0.2em]">-{discount}%</span>
                                )}
                            </div>
                        )}

                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={img}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    aria-label={`Ver foto ${idx + 1}`}
                                    aria-current={currentImageIndex === idx}
                                    className={`relative w-20 h-28 flex-shrink-0 bg-[#111114] border transition-all ${
                                        currentImageIndex === idx
                                            ? "border-white opacity-100 ring-1 ring-white"
                                            : "border-white/10 opacity-50 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detalhes */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="border-b border-white/10 pb-6 mb-6">
                        <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2 block">
                            {product.category}{product.newProduct ? " · Novidade" : ""}
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-wider text-white uppercase mb-4">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-baseline gap-3 text-2xl">
                            {product.promotionalPrice ? (
                                <>
                                    <span className="text-zinc-500 line-through text-lg font-mono">{formatPrice(product.price)}</span>
                                    <span className="text-white font-bold font-mono">{formatPrice(finalPrice)}</span>
                                    {discount && (
                                        <span className="bg-white text-black text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-widest">
                                            {discount}% off
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-white font-bold font-mono">{formatPrice(finalPrice)}</span>
                            )}
                        </div>

                        <p className="text-xs text-zinc-400 mt-2 tracking-wide">
                            em até {formatInstallment(finalPrice)} sem juros no cartão
                        </p>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed tracking-wide mb-8">{product.description}</p>

                    {/* Tamanhos */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span id="size-label" className="text-xs font-semibold uppercase tracking-widest text-white">
                                {product.sizes.length === 1 && product.sizes[0] === "U" ? "Tamanho Único" : "Selecione o Tamanho"}
                            </span>
                            {product.category !== "Acessórios" && (
                                <button
                                    type="button"
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors uppercase tracking-wider underline underline-offset-4"
                                >
                                    <Ruler className="w-3.5 h-3.5" /> Guia de Medidas
                                </button>
                            )}
                        </div>

                        <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2.5">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    role="radio"
                                    aria-checked={selectedSize === size}
                                    disabled={isSoldOut}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setMessage(null);
                                    }}
                                    className={`w-12 h-12 text-xs font-semibold tracking-wider transition-all flex items-center justify-center border disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through ${
                                        selectedSize === size
                                            ? "border-white bg-white text-black font-bold scale-105 shadow-lg"
                                            : "border-white/15 bg-zinc-900/50 text-zinc-300 hover:border-white hover:text-white"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Estoque + quantidade */}
                    {!isSoldOut && (
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div className="flex items-center border border-white/15 bg-black/40" aria-label="Quantidade">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, qty - 1))}
                                    disabled={qty <= 1}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                                    aria-label="Diminuir quantidade"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-10 text-center text-sm font-mono" aria-live="polite">{qty}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(maxQty, qty + 1))}
                                    disabled={qty >= remaining}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                                    aria-label="Aumentar quantidade"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <p className={`text-[11px] uppercase tracking-widest ${product.stock <= LOW_STOCK ? "text-amber-300" : "text-zinc-400"}`}>
                                {remaining === 0
                                    ? "Todas as unidades já estão na sua sacola"
                                    : product.stock <= LOW_STOCK
                                        ? `Últimas ${product.stock} unidades`
                                        : "Em estoque"}
                            </p>
                        </div>
                    )}

                    {message && (
                        <div
                            role="alert"
                            className={`mb-4 p-3 border text-xs tracking-wider flex items-center gap-2 ${
                                message.type === "error"
                                    ? "bg-red-950/40 border-red-500/40 text-red-300"
                                    : "bg-amber-950/30 border-amber-400/30 text-amber-200"
                            }`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            {message.text}
                        </div>
                    )}

                    {/* Ações */}
                    <div className="space-y-3">
                        {isSoldOut ? (
                            <>
                                <button disabled className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] bg-zinc-800 text-zinc-400 cursor-not-allowed">
                                    Produto Esgotado
                                </button>
                                <a
                                    href={whatsappUrl(`Olá! Quero ser avisado quando o produto "${product.name}" voltar ao estoque.`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white hover:text-black transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" /> Avise-me quando chegar
                                </a>
                            </>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={remaining === 0}
                                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:bg-zinc-800 disabled:text-zinc-400 disabled:cursor-not-allowed ${
                                    isAddedSuccess ? "bg-emerald-400 text-black" : "bg-white text-black hover:bg-zinc-200"
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
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-400">
                            <div className="flex items-center gap-2 p-2.5 bg-zinc-900/40 border border-white/5">
                                <Truck className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                                <span>Frete grátis (PAC) acima de {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-zinc-900/40 border border-white/5">
                                <RotateCcw className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                                <span>Primeira troca grátis em até 30 dias</span>
                            </div>
                        </div>
                    </div>

                    {/* Simulação de frete: usa as mesmas tarifas do checkout */}
                    <form
                        className="mt-8 border border-white/10 p-5 bg-[#111114]"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowShipping(cep.replace(/\D/g, "").length === 8);
                        }}
                    >
                        <label htmlFor="cep-sim" className="text-xs font-semibold text-white uppercase tracking-widest mb-4 block">
                            Calcular Frete e Prazo
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="cep-sim"
                                type="text"
                                inputMode="numeric"
                                autoComplete="postal-code"
                                placeholder="00000-000"
                                value={cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                                className="flex-1 min-w-0 bg-transparent border border-white/10 px-3 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                            />
                            <button type="submit" className="px-5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">
                                Calcular
                            </button>
                        </div>
                        {showShipping && (
                            <ul className="mt-4 pt-4 border-t border-white/10 text-xs text-zinc-300 space-y-2">
                                {getShippingOptions(finalPrice * qty).map((opt) => (
                                    <li key={opt.id} className="flex justify-between gap-4">
                                        <span>
                                            <strong className="text-white">{opt.name}</strong> · {opt.deadline}
                                        </span>
                                        <span className="font-mono">
                                            {opt.price === 0 ? <span className="text-emerald-400 font-bold">GRÁTIS</span> : formatPrice(opt.price)}
                                        </span>
                                    </li>
                                ))}
                                <li className="text-[10px] text-zinc-500 pt-1">
                                    Valores estimados para {qty} unidade(s). O frete final é confirmado no atendimento pelo WhatsApp.
                                </li>
                            </ul>
                        )}
                        {cep.length > 0 && cep.replace(/\D/g, "").length < 8 && (
                            <p className="mt-2 text-[10px] text-zinc-500">Digite os 8 números do CEP.</p>
                        )}
                        <a
                            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 underline underline-offset-4 mt-3 inline-block transition-colors"
                        >
                            Não sei meu CEP
                        </a>
                    </form>

                    {/* Acordeões */}
                    <div className="mt-10 border-t border-white/10 divide-y divide-white/10">
                        {accordions.map((acc) => (
                            <div key={acc.id}>
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(acc.id)}
                                    aria-expanded={openAccordion === acc.id}
                                    aria-controls={`acc-${acc.id}`}
                                    className="w-full py-4 text-xs font-semibold text-white uppercase tracking-widest flex justify-between items-center hover:text-zinc-300 transition-colors"
                                >
                                    {acc.title}
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openAccordion === acc.id ? "rotate-180" : ""}`} />
                                </button>
                                {openAccordion === acc.id && (
                                    <ul id={`acc-${acc.id}`} className="pb-4 text-xs text-zinc-400 leading-relaxed space-y-1.5">
                                        {acc.items.map((item) => (
                                            <li key={item}>• {item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <section className="mt-24 pt-16 border-t border-white/10">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider mb-10 text-center">
                        Complete o Look
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
                        {relatedProducts.map((rel) => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </section>
            )}

            {/* Barra fixa de compra no celular */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 p-4 lg:hidden flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-zinc-400 tracking-widest uppercase truncate">{product.name}</span>
                    <span className="text-sm font-bold text-white font-mono">{formatPrice(finalPrice)}</span>
                </div>
                <button
                    onClick={() => {
                        if (!selectedSize || isSoldOut) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        handleAddToCart();
                    }}
                    disabled={!isSoldOut && remaining === 0}
                    className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0 disabled:bg-zinc-800 disabled:text-zinc-400 ${
                        isSoldOut ? "bg-zinc-800 text-zinc-400" : isAddedSuccess ? "bg-emerald-400 text-black" : "bg-white text-black"
                    }`}
                >
                    {isSoldOut ? "Esgotado" : isAddedSuccess ? "Na Sacola" : "Comprar"}
                </button>
            </div>

            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} category={product.category} />
        </div>
    );
}
