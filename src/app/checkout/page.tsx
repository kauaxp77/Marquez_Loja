"use client";

import { useCart } from "@/lib/CartContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const router = useRouter();

    const [formData, setFormData] = useState({
        nome: "",
        cidade: "",
        estado: "",
        observacao: ""
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-24 px-4 text-center">
                <h1 className="text-2xl font-bold tracking-widest uppercase mb-4">Sacola Vazia</h1>
                <p className="text-[#BFC0C2] mb-8">Você precisa adicionar produtos à sacola para finalizar o pedido.</p>
                <Link href="/loja" className="bg-white text-black px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:bg-[#E5E5E5] transition-colors">
                    Explorar Coleção
                </Link>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Generate WhatsApp Message
        let text = `Olá, Marquez! Gostaria de finalizar meu pedido.\n\n`;
        text += `*PEDIDO MARQUEZ*\n\n`;

        cartItems.forEach(item => {
            text += `Produto: ${item.product.name}\n`;
            text += `Tamanho: ${item.size}\n`;
            text += `Quantidade: ${item.quantity}\n`;
            text += `Valor: R$ ${((item.product.promotionalPrice || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
        });

        text += `*Subtotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}*\n\n`;

        // User info
        text += `*DADOS DO CLIENTE*\n`;
        text += `Nome: ${formData.nome}\n`;
        text += `Local: ${formData.cidade} - ${formData.estado}\n`;
        if (formData.observacao) {
            text += `Obs: ${formData.observacao}\n`;
        }

        text += `\nGostaria de finalizar a compra e receber as informações para pagamento e entrega.`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/556191774178?text=${encodedText}`;

        window.location.href = whatsappUrl;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

            <Link href="/loja" className="inline-flex items-center gap-2 text-sm text-[#BFC0C2] hover:text-white uppercase tracking-widest mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Voltar para Loja
            </Link>

            <h1 className="text-3xl font-bold tracking-[0.1em] text-white uppercase mb-12 text-center md:text-left">
                Finalizar Pedido
            </h1>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

                {/* Left: Form */}
                <div className="w-full md:w-1/2">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-xs font-medium text-[#BFC0C2] tracking-widest uppercase mb-2">Nome Completo</label>
                            <input
                                required
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-[#1C1C1C] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                                placeholder="Seu nome"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="cidade" className="block text-xs font-medium text-[#BFC0C2] tracking-widest uppercase mb-2">Cidade</label>
                                <input
                                    required
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    className="w-full bg-[#080808] border border-[#1C1C1C] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                                    placeholder="Sua cidade"
                                />
                            </div>
                            <div className="w-24 flex-shrink-0">
                                <label htmlFor="estado" className="block text-xs font-medium text-[#BFC0C2] tracking-widest uppercase mb-2">Estado</label>
                                <input
                                    required
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    maxLength={2}
                                    value={formData.estado.toUpperCase()}
                                    onChange={handleChange}
                                    className="w-full bg-[#080808] border border-[#1C1C1C] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors uppercase text-center"
                                    placeholder="UF"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="observacao" className="block text-xs font-medium text-[#BFC0C2] tracking-widest uppercase mb-2">Observação (Opcional)</label>
                            <textarea
                                id="observacao"
                                name="observacao"
                                rows={3}
                                value={formData.observacao}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-[#1C1C1C] text-white px-4 py-3 focus:outline-none focus:border-white transition-colors custom-scrollbar"
                                placeholder="Detalhes ou preferência de entrega"
                            />
                        </div>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="w-full md:w-1/2">
                    <div className="bg-[#080808] border border-[#1C1C1C] p-6 lg:p-8">
                        <h2 className="text-sm font-medium tracking-widest text-white uppercase mb-6 flex items-center justify-between border-b border-[#1C1C1C] pb-4">
                            Revisar Pedido
                            <span className="text-[#BFC0C2] bg-[#121212] px-2 py-0.5 rounded-full text-[10px]">{cartItems.length} Itens</span>
                        </h2>

                        <div className="space-y-4 mb-6 custom-scrollbar max-h-60 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-start text-sm">
                                    <div className="pr-4">
                                        <p className="font-medium text-white line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-[#BFC0C2] mt-1 space-x-2">
                                            <span>Tam: {item.size}</span>
                                            <span>Qtd: {item.quantity}</span>
                                        </p>
                                    </div>
                                    <p className="font-medium text-white whitespace-nowrap">
                                        R$ {((item.product.promotionalPrice || item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#1C1C1C] pt-6 mb-8">
                            <div className="flex justify-between items-center text-lg font-bold text-white tracking-wide">
                                <span>SUBTOTAL</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-white text-black font-semibold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-[#E5E5E5] transition-colors"
                        >
                            Enviar Pedido pelo WhatsApp
                        </button>
                        <p className="text-xs text-[#BFC0C2] flex items-center justify-center gap-2 mt-4 text-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> O pagamento será combinado via WhatsApp.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
