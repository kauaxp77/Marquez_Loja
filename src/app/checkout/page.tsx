"use client";

import { useCart } from "@/lib/CartContext";
import { ArrowLeft, CheckCircle2, Copy, Check, Truck, QrCode, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const FREE_SHIPPING_THRESHOLD = 350;
const PIX_KEY = "wendesonkaua11@gmail.com";

interface ShippingOption {
    id: "pac" | "sedex";
    name: string;
    deadline: string;
    price: number;
}

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const [formData, setFormData] = useState({
        nome: "",
        cep: "",
        cidade: "",
        estado: "",
        observacao: ""
    });

    const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;

    const shippingOptions: ShippingOption[] = [
        { id: "pac", name: "PAC Expresso", deadline: "5 a 7 dias úteis", price: isFreeShipping ? 0 : 22.90 },
        { id: "sedex", name: "SEDEX Prioritário", deadline: "2 a 3 dias úteis", price: 38.50 },
    ];

    const [selectedShipping, setSelectedShipping] = useState<"pac" | "sedex">("pac");
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "whatsapp">("pix");
    const [copiedPix, setCopiedPix] = useState(false);

    if (!isMounted) return null;

    if (cartItems.length === 0) {
        return (
            <div className="pt-36 pb-24 px-4 text-center max-w-md mx-auto">
                <h1 className="text-2xl font-bold font-display tracking-widest uppercase mb-3">Sua Sacola Está Vazia</h1>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                    Adicione ao menos uma peça exclusiva do catálogo MARQUEZ antes de avançar para a finalização.
                </p>
                <Link href="/loja" className="inline-block bg-white text-black px-8 py-3.5 font-bold uppercase tracking-[0.18em] text-xs hover:bg-zinc-200 transition-colors">
                    Explorar Coleção
                </Link>
            </div>
        );
    }

    const currentShipping = shippingOptions.find(s => s.id === selectedShipping) || shippingOptions[0];
    const finalTotal = cartTotal + currentShipping.price;

    const handleCopyPix = () => {
        navigator.clipboard.writeText(PIX_KEY);
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 2500);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = `${value.slice(0, 5)}-${value.slice(5)}`;
        }
        setFormData(prev => ({ ...prev, cep: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build elegant WhatsApp message
        let text = `*SOLICITAÇÃO DE PEDIDO — MARQUEZ*\n`;
        text += `────────────────────────────\n\n`;

        text += `*ITENS ESCOLHIDOS:*\n`;
        cartItems.forEach((item, index) => {
            const price = (item.product.promotionalPrice || item.product.price) * item.quantity;
            text += `${index + 1}. ${item.product.name}\n`;
            text += `   • Tamanho: ${item.size} | Qtd: ${item.quantity}\n`;
            text += `   • Valor: R$ ${price.toFixed(2).replace('.', ',')}\n\n`;
        });

        text += `────────────────────────────\n`;
        text += `*RESUMO DOS VALORES:*\n`;
        text += `• Subtotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
        text += `• Envio (${currentShipping.name}): ${currentShipping.price === 0 ? "GRÁTIS" : `R$ ${currentShipping.price.toFixed(2).replace('.', ',')}`}\n`;
        text += `• *TOTAL DO PEDIDO: R$ ${finalTotal.toFixed(2).replace('.', ',')}*\n\n`;

        text += `*DADOS DO CLIENTE:*\n`;
        text += `• Nome: ${formData.nome}\n`;
        text += `• CEP: ${formData.cep || "Não informado"}\n`;
        text += `• Cidade/UF: ${formData.cidade} - ${formData.estado.toUpperCase()}\n`;
        if (formData.observacao) {
            text += `• Obs: ${formData.observacao}\n`;
        }
        text += `• Pagamento preferido: ${paymentMethod === "pix" ? "PIX (Chave direta)" : "Combinar no WhatsApp"}\n\n`;

        text += `Olá! Acabei de registrar meu pedido no site da MARQUEZ e gostaria de confirmar a disponibilidade e o envio.`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/556191774178?text=${encodedText}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="pt-32 lg:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <Link
                href="/loja"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white uppercase tracking-widest mb-8 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Continuar Comprando
            </Link>

            <div className="mb-10">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                    Etapa Final
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-wider text-white uppercase">
                    Finalizar Pedido
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                {/* Left: Form & Preferences */}
                <div className="w-full lg:w-3/5 space-y-8">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Data */}
                        <div className="bg-[#111114] border border-white/10 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10">
                                1. Dados de Envio
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nome" className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
                                        Nome Completo *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900/60 border border-white/15 text-white px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
                                        placeholder="Ex.: Carlos Mendes Marquez"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label htmlFor="cep" className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
                                            CEP *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="cep"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleCepChange}
                                            maxLength={9}
                                            className="w-full bg-zinc-900/60 border border-white/15 text-white px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors font-mono"
                                            placeholder="70000-000"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 flex gap-3">
                                        <div className="flex-1">
                                            <label htmlFor="cidade" className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
                                                Cidade *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="cidade"
                                                name="cidade"
                                                value={formData.cidade}
                                                onChange={handleChange}
                                                className="w-full bg-zinc-900/60 border border-white/15 text-white px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors"
                                                placeholder="Sua cidade"
                                            />
                                        </div>
                                        <div className="w-20 flex-shrink-0">
                                            <label htmlFor="estado" className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
                                                UF *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                id="estado"
                                                name="estado"
                                                maxLength={2}
                                                value={formData.estado.toUpperCase()}
                                                onChange={handleChange}
                                                className="w-full bg-zinc-900/60 border border-white/15 text-white px-3 py-3 text-xs focus:outline-none focus:border-white transition-colors uppercase text-center font-mono"
                                                placeholder="DF"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="observacao" className="block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5">
                                        Observações ou Complemento (Opcional)
                                    </label>
                                    <textarea
                                        id="observacao"
                                        name="observacao"
                                        rows={2}
                                        value={formData.observacao}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900/60 border border-white/15 text-white px-4 py-2.5 text-xs focus:outline-none focus:border-white transition-colors custom-scrollbar"
                                        placeholder="Ex.: Apto 402, bloco B ou preferência de horário"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Selection */}
                        <div className="bg-[#111114] border border-white/10 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                                <Truck className="w-3.5 h-3.5" /> 2. Opção de Frete
                            </h2>

                            <div className="space-y-3">
                                {shippingOptions.map((opt) => {
                                    const isSelected = selectedShipping === opt.id;
                                    return (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                                                isSelected
                                                    ? "bg-zinc-900 border-white text-white"
                                                    : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:border-white/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    checked={isSelected}
                                                    onChange={() => setSelectedShipping(opt.id)}
                                                    className="w-4 h-4 text-black border-white/30 focus:ring-0 bg-transparent"
                                                />
                                                <div>
                                                    <p className="text-xs font-semibold text-white uppercase tracking-wider">{opt.name}</p>
                                                    <p className="text-[11px] text-zinc-400">{opt.deadline}</p>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono text-xs">
                                                {opt.price === 0 ? (
                                                    <span className="text-emerald-400 font-bold uppercase">Grátis</span>
                                                ) : (
                                                    <span className="font-semibold text-white">
                                                        R$ {opt.price.toFixed(2).replace('.', ',')}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Preference */}
                        <div className="bg-[#111114] border border-white/10 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                                <QrCode className="w-3.5 h-3.5" /> 3. Pagamento
                            </h2>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("pix")}
                                    className={`p-3.5 border text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                                        paymentMethod === "pix"
                                            ? "border-white bg-white text-black"
                                            : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-white/30"
                                    }`}
                                >
                                    <QrCode className="w-4 h-4" />
                                    <span>Pix Instantâneo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("whatsapp")}
                                    className={`p-3.5 border text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                                        paymentMethod === "whatsapp"
                                            ? "border-white bg-white text-black"
                                            : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-white/30"
                                    }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Cartão / WhatsApp</span>
                                </button>
                            </div>

                            {paymentMethod === "pix" && (
                                <div className="p-4 bg-zinc-900/80 border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono text-zinc-400 uppercase">Chave Pix (E-mail):</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyPix}
                                            className="text-[11px] font-semibold text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                                        >
                                            {copiedPix ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Copiado!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" /> Copiar Chave
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="p-2.5 bg-black/60 border border-white/10 font-mono text-xs text-white text-center select-all">
                                        {PIX_KEY}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                                        Após enviar o pedido pelo WhatsApp, basta anexar o comprovante para separação prioritária imediata.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-[#111114] border border-white/10 p-6 sticky top-28">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6 pb-3 border-b border-white/10 flex items-center justify-between">
                            Resumo da Compra
                            <span className="text-zinc-400 font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5">
                                {cartItems.length} {cartItems.length === 1 ? "Item" : "Itens"}
                            </span>
                        </h2>

                        <div className="space-y-3 mb-6 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                            {cartItems.map(item => (
                                <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                                    <div className="pr-3">
                                        <p className="font-bold text-white uppercase tracking-wider line-clamp-1 font-display">{item.product.name}</p>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                                            Tam: {item.size} • Qtd: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold font-mono text-white whitespace-nowrap">
                                        R$ {((item.product.promotionalPrice || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-white/10 pt-4 mb-6 text-xs">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span className="font-mono text-white">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Envio ({currentShipping.name})</span>
                                <span className="font-mono text-white">
                                    {currentShipping.price === 0 ? (
                                        <span className="text-emerald-400 font-bold uppercase">Grátis</span>
                                    ) : (
                                        `R$ ${currentShipping.price.toFixed(2).replace('.', ',')}`
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-white">
                                <span className="font-bold uppercase tracking-wider font-display">Total Final</span>
                                <span className="text-xl font-bold font-mono">
                                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-white text-black font-bold uppercase tracking-[0.18em] py-4 text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
                        >
                            Enviar Pedido pelo WhatsApp
                        </button>

                        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                Atendimento direto com a equipe MARQUEZ
                            </p>
                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                Rastreamento enviado após o despacho
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
