"use client";

import { useCart } from "@/lib/CartContext";
import { getFinalPrice } from "@/lib/data";
import {
    FREE_SHIPPING_THRESHOLD,
    STORE,
    ShippingId,
    formatPrice,
    getShippingOptions,
    roundMoney,
    whatsappUrl,
} from "@/lib/store";
import { ArrowLeft, CheckCircle2, Copy, Check, Truck, QrCode, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const inputClass =
    "w-full bg-zinc-900/60 border border-white/15 text-white px-4 py-3 text-xs focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600";
const labelClass = "block text-[11px] font-medium text-zinc-400 tracking-wider uppercase mb-1.5";

export default function CheckoutPage() {
    const { cartItems, cartTotal, itemCount, clearCart } = useCart();
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        cep: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        observacao: "",
    });
    const [selectedShipping, setSelectedShipping] = useState<ShippingId>("pac");
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("pix");
    const [copiedPix, setCopiedPix] = useState(false);
    const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "error">("idle");
    const [sentUrl, setSentUrl] = useState<string | null>(null);

    if (!isMounted) return null;

    if (sentUrl) {
        return (
            <div className="pt-36 pb-24 px-4 text-center max-w-md mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold font-display tracking-widest uppercase mb-3">Pedido Enviado</h1>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                    Abrimos o WhatsApp com o resumo do seu pedido. Envie a mensagem para a equipe MARQUEZ confirmar estoque,
                    frete e pagamento.
                </p>
                <div className="flex flex-col gap-3">
                    <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white px-8 py-3.5 font-bold uppercase tracking-[0.18em] text-xs hover:bg-white hover:text-black transition-colors">
                        O WhatsApp não abriu? Abrir novamente
                    </a>
                    <Link href="/loja" onClick={clearCart} className="bg-white text-black px-8 py-3.5 font-bold uppercase tracking-[0.18em] text-xs hover:bg-zinc-200 transition-colors">
                        Concluir e esvaziar sacola
                    </Link>
                    <button type="button" onClick={() => setSentUrl(null)} className="text-[11px] text-zinc-500 hover:text-white uppercase tracking-widest underline underline-offset-4">
                        Editar pedido
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="pt-36 pb-24 px-4 text-center max-w-md mx-auto">
                <h1 className="text-2xl font-bold font-display tracking-widest uppercase mb-3">Sua Sacola Está Vazia</h1>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                    Adicione ao menos uma peça do catálogo MARQUEZ antes de avançar para a finalização.
                </p>
                <Link href="/loja" className="inline-block bg-white text-black px-8 py-3.5 font-bold uppercase tracking-[0.18em] text-xs hover:bg-zinc-200 transition-colors">
                    Explorar Coleção
                </Link>
            </div>
        );
    }

    const shippingOptions = getShippingOptions(cartTotal);
    const currentShipping = shippingOptions.find((s) => s.id === selectedShipping) ?? shippingOptions[0];
    const finalTotal = roundMoney(cartTotal + currentShipping.price);
    const amountLeft = roundMoney(FREE_SHIPPING_THRESHOLD - cartTotal);

    const handleCopyPix = async () => {
        try {
            await navigator.clipboard.writeText(STORE.pixKey);
            setCopiedPix(true);
            setTimeout(() => setCopiedPix(false), 2500);
        } catch {
            // navegador sem permissão de área de transferência: a chave continua visível para copiar manualmente
        }
    };

    const lookupCep = async (digits: string) => {
        setCepStatus("loading");
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (data.erro) throw new Error("CEP não encontrado");
            setFormData((prev) => ({
                ...prev,
                endereco: data.logradouro || prev.endereco,
                bairro: data.bairro || prev.bairro,
                cidade: data.localidade || prev.cidade,
                estado: data.uf || prev.estado,
            }));
            setCepStatus("idle");
        } catch {
            setCepStatus("error");
        }
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
        const value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        setFormData((prev) => ({ ...prev, cep: value }));
        setCepStatus("idle");
        if (digits.length === 8) lookupCep(digits);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const d = e.target.value.replace(/\D/g, "").slice(0, 11);
        let value = d;
        if (d.length > 2) value = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length > 7) value = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(d.length - 4)}`;
        setFormData((prev) => ({ ...prev, telefone: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const line = "────────────────────";
        let text = `*PEDIDO — MARQUEZ*\n${line}\n\n*ITENS:*\n`;
        cartItems.forEach((item, index) => {
            const unit = getFinalPrice(item.product);
            text += `${index + 1}. ${item.product.name}\n`;
            text += `   • Tamanho: ${item.size} | Qtd: ${item.quantity} x ${formatPrice(unit)}\n`;
            text += `   • Valor: ${formatPrice(unit * item.quantity)}\n\n`;
        });

        text += `${line}\n*VALORES:*\n`;
        text += `• Subtotal: ${formatPrice(cartTotal)}\n`;
        text += `• Frete (${currentShipping.name}, ${currentShipping.deadline}): ${currentShipping.price === 0 ? "GRÁTIS" : formatPrice(currentShipping.price)}\n`;
        text += `• *TOTAL: ${formatPrice(finalTotal)}*\n`;
        text += `• Pagamento: ${paymentMethod === "pix" ? "Pix" : "Cartão (link de pagamento)"}\n\n`;

        text += `*ENTREGA:*\n`;
        text += `• Nome: ${formData.nome.trim()}\n`;
        if (formData.telefone) text += `• Telefone: ${formData.telefone}\n`;
        text += `• Endereço: ${formData.endereco.trim()}, ${formData.numero.trim()}`;
        text += formData.bairro.trim() ? ` — ${formData.bairro.trim()}\n` : "\n";
        text += `• ${formData.cidade.trim()}/${formData.estado} — CEP ${formData.cep}\n`;
        if (formData.observacao.trim()) text += `• Obs.: ${formData.observacao.trim()}\n`;

        text += `\nOlá! Acabei de montar meu pedido no site e gostaria de confirmar a disponibilidade e o envio.`;

        const url = whatsappUrl(text);
        window.open(url, "_blank", "noopener,noreferrer");
        setSentUrl(url);
        window.scrollTo({ top: 0 });
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
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">Etapa Final</span>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-wider text-white uppercase">Finalizar Pedido</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                <div className="w-full lg:w-3/5 space-y-8">
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Dados */}
                        <fieldset className="bg-[#111114] border border-white/10 p-6">
                            <legend className="sr-only">Dados de envio</legend>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10">
                                1. Dados de Envio
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="nome" className={labelClass}>Nome Completo *</label>
                                        <input required minLength={3} type="text" id="nome" name="nome" autoComplete="name" value={formData.nome} onChange={handleChange} className={inputClass} placeholder="Seu nome" />
                                    </div>
                                    <div>
                                        <label htmlFor="telefone" className={labelClass}>Telefone / WhatsApp</label>
                                        <input type="tel" id="telefone" name="telefone" autoComplete="tel-national" inputMode="numeric" value={formData.telefone} onChange={handlePhoneChange} pattern="\(\d{2}\) \d{4,5}-\d{4}" title="DDD + número" className={`${inputClass} font-mono`} placeholder="(61) 90000-0000" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label htmlFor="cep" className={labelClass}>CEP *</label>
                                        <div className="relative">
                                            <input required type="text" id="cep" name="cep" inputMode="numeric" autoComplete="postal-code" value={formData.cep} onChange={handleCepChange} pattern="\d{5}-\d{3}" title="CEP com 8 números" className={`${inputClass} font-mono`} placeholder="70000-000" />
                                            {cepStatus === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />}
                                        </div>
                                        {cepStatus === "error" && <p className="text-[10px] text-amber-300 mt-1">CEP não encontrado. Preencha o endereço manualmente.</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="endereco" className={labelClass}>Endereço *</label>
                                        <input required type="text" id="endereco" name="endereco" autoComplete="address-line1" value={formData.endereco} onChange={handleChange} className={inputClass} placeholder="Rua, quadra, avenida" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                                    <div className="sm:col-span-1">
                                        <label htmlFor="numero" className={labelClass}>Nº *</label>
                                        <input required type="text" id="numero" name="numero" value={formData.numero} onChange={handleChange} className={inputClass} placeholder="123" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="bairro" className={labelClass}>Bairro</label>
                                        <input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} className={inputClass} placeholder="Bairro" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="cidade" className={labelClass}>Cidade *</label>
                                        <input required type="text" id="cidade" name="cidade" autoComplete="address-level2" value={formData.cidade} onChange={handleChange} className={inputClass} placeholder="Cidade" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label htmlFor="estado" className={labelClass}>UF *</label>
                                        <select required id="estado" name="estado" autoComplete="address-level1" value={formData.estado} onChange={handleChange} className={`${inputClass} px-2 font-mono`}>
                                            <option value="">--</option>
                                            {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="observacao" className={labelClass}>Complemento ou Observações (Opcional)</label>
                                    <textarea id="observacao" name="observacao" rows={2} maxLength={300} value={formData.observacao} onChange={handleChange} className={`${inputClass} custom-scrollbar`} placeholder="Ex.: Apto 402, bloco B ou preferência de horário" />
                                </div>
                            </div>
                        </fieldset>

                        {/* 2. Frete */}
                        <fieldset className="bg-[#111114] border border-white/10 p-6">
                            <legend className="sr-only">Opção de frete</legend>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                                <Truck className="w-3.5 h-3.5" /> 2. Opção de Frete
                            </h2>
                            {amountLeft > 0 && (
                                <p className="text-[11px] text-zinc-400 mb-3">
                                    Faltam <strong className="text-white font-mono">{formatPrice(amountLeft)}</strong> para frete grátis no PAC.
                                </p>
                            )}
                            <div className="space-y-3">
                                {shippingOptions.map((opt) => {
                                    const isSelected = selectedShipping === opt.id;
                                    return (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                                                isSelected ? "bg-zinc-900 border-white text-white" : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:border-white/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="shipping" checked={isSelected} onChange={() => setSelectedShipping(opt.id)} className="w-4 h-4 accent-white" />
                                                <div>
                                                    <p className="text-xs font-semibold text-white uppercase tracking-wider">{opt.name}</p>
                                                    <p className="text-[11px] text-zinc-400">{opt.deadline}</p>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono text-xs">
                                                {opt.price === 0 ? (
                                                    <span className="text-emerald-400 font-bold uppercase">Grátis</span>
                                                ) : (
                                                    <span className="font-semibold text-white">{formatPrice(opt.price)}</span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-3">Prazo contado a partir da confirmação do pagamento.</p>
                        </fieldset>

                        {/* 3. Pagamento */}
                        <fieldset className="bg-[#111114] border border-white/10 p-6">
                            <legend className="sr-only">Forma de pagamento</legend>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
                                <QrCode className="w-3.5 h-3.5" /> 3. Pagamento
                            </h2>

                            <div className="grid grid-cols-2 gap-3 mb-4" role="radiogroup" aria-label="Forma de pagamento">
                                {([
                                    { id: "pix", label: "Pix", Icon: QrCode },
                                    { id: "cartao", label: "Cartão em até 3x", Icon: MessageCircle },
                                ] as const).map(({ id, label, Icon }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        role="radio"
                                        aria-checked={paymentMethod === id}
                                        onClick={() => setPaymentMethod(id)}
                                        className={`p-3.5 border text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                                            paymentMethod === id ? "border-white bg-white text-black" : "border-white/10 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-white/30"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>

                            {paymentMethod === "pix" ? (
                                <div className="p-4 bg-zinc-900/80 border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono text-zinc-400 uppercase">Chave Pix ({STORE.pixKeyType}):</span>
                                        <button type="button" onClick={handleCopyPix} className="text-[11px] font-semibold text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                                            {copiedPix ? (<><Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Copiado!</>) : (<><Copy className="w-3.5 h-3.5" /> Copiar Chave</>)}
                                        </button>
                                    </div>
                                    <div className="p-2.5 bg-black/60 border border-white/10 font-mono text-xs text-white text-center select-all break-all">{STORE.pixKeyDisplay}</div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                                        Faça o Pix de <strong className="text-white">{formatPrice(finalTotal)}</strong> somente após a equipe confirmar o estoque
                                        no WhatsApp, e envie o comprovante na mesma conversa.
                                    </p>
                                </div>
                            ) : (
                                <p className="p-4 bg-zinc-900/80 border border-white/10 text-[11px] text-zinc-400 leading-relaxed">
                                    Enviamos um link de pagamento seguro pelo WhatsApp, em até 3x sem juros de {formatPrice(finalTotal / 3)}.
                                </p>
                            )}
                        </fieldset>
                    </form>
                </div>

                {/* Resumo */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-[#111114] border border-white/10 p-6 lg:sticky lg:top-28">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6 pb-3 border-b border-white/10 flex items-center justify-between">
                            Resumo da Compra
                            <span className="text-zinc-400 font-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5">
                                {itemCount} {itemCount === 1 ? "Item" : "Itens"}
                            </span>
                        </h2>

                        <div className="space-y-3 mb-6 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                            {cartItems.map((item) => (
                                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-start text-xs border-b border-white/5 pb-3">
                                    <img src={item.product.images[0]} alt="" className="w-10 h-14 object-cover border border-white/10 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white uppercase tracking-wider line-clamp-1 font-display">{item.product.name}</p>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Tam: {item.size} • Qtd: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold font-mono text-white whitespace-nowrap">
                                        {formatPrice(getFinalPrice(item.product) * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-white/10 pt-4 mb-6 text-xs">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span className="font-mono text-white">{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Frete ({currentShipping.name})</span>
                                <span className="font-mono text-white">
                                    {currentShipping.price === 0 ? <span className="text-emerald-400 font-bold uppercase">Grátis</span> : formatPrice(currentShipping.price)}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-white">
                                <span className="font-bold uppercase tracking-wider font-display">Total</span>
                                <span className="text-xl font-bold font-mono">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-white text-black font-bold uppercase tracking-[0.18em] py-4 text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
                        >
                            <MessageCircle className="w-4 h-4" /> Enviar Pedido pelo WhatsApp
                        </button>

                        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                            <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />Atendimento direto com a equipe MARQUEZ</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />Código de rastreio enviado após o despacho</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
