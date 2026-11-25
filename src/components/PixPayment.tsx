"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy } from "lucide-react";
import { buildPixPayload } from "@/lib/pix";
import { STORE, formatPrice } from "@/lib/store";

type Copied = "code" | "key" | null;

// QR Code e "Pix copia e cola" com o valor exato do pedido (produtos + frete).
export function PixPayment({ amount }: { amount: number }) {
    const [qrSrc, setQrSrc] = useState<string | null>(null);
    const [copied, setCopied] = useState<Copied>(null);

    const payload = useMemo(
        () =>
            buildPixPayload({
                key: STORE.pixKey,
                amount,
                merchantName: STORE.pixMerchantName,
                merchantCity: STORE.pixMerchantCity,
            }),
        [amount]
    );

    useEffect(() => {
        let active = true;
        QRCode.toDataURL(payload, { margin: 1, width: 440, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } })
            .then((url) => active && setQrSrc(url))
            .catch(() => active && setQrSrc(null));
        return () => { active = false; };
    }, [payload]);

    const copy = async (text: string, which: Exclude<Copied, null>) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(which);
            setTimeout(() => setCopied(null), 2500);
        } catch {
            // sem permissão de área de transferência: o código continua visível para copiar manualmente
        }
    };

    return (
        <div className="p-4 sm:p-5 bg-zinc-900/80 border border-white/10">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <div className="bg-white p-2.5 flex-shrink-0">
                    {qrSrc ? (
                        <img src={qrSrc} alt={`QR Code Pix de ${formatPrice(amount)}`} width={176} height={176} className="w-44 h-44 block" />
                    ) : (
                        <div className="w-44 h-44 bg-zinc-200 animate-pulse" aria-hidden />
                    )}
                </div>

                <div className="flex-1 w-full min-w-0 space-y-3 text-center sm:text-left">
                    <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Valor do Pix</span>
                        <span className="text-2xl font-bold font-mono text-white">{formatPrice(amount)}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Abra o app do seu banco, escolha <strong className="text-white">Pix &gt; Ler QR Code</strong> ou use o
                        Pix copia e cola. O valor já vem preenchido.
                    </p>
                    <button
                        type="button"
                        onClick={() => copy(payload, "code")}
                        className={`w-full py-3 text-[11px] font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors ${
                            copied === "code" ? "bg-emerald-400 text-black" : "bg-white text-black hover:bg-zinc-200"
                        }`}
                    >
                        {copied === "code" ? <><Check className="w-3.5 h-3.5 stroke-[3]" /> Código copiado!</> : <><Copy className="w-3.5 h-3.5" /> Pix copia e cola</>}
                    </button>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-zinc-400">
                    Chave ({STORE.pixKeyType}): <span className="font-mono text-white">{STORE.pixKeyDisplay}</span>
                </span>
                <button
                    type="button"
                    onClick={() => copy(STORE.pixKey, "key")}
                    className="font-semibold text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                >
                    {copied === "key" ? <><Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Copiada!</> : <><Copy className="w-3.5 h-3.5" /> Copiar chave</>}
                </button>
            </div>

            <p className="mt-3 text-[11px] text-zinc-500 leading-relaxed">
                Pague somente depois que a equipe confirmar o estoque no WhatsApp e envie o comprovante na mesma conversa.
            </p>
        </div>
    );
}
