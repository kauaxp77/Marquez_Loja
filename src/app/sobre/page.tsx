import type { Metadata } from "next";
import Link from "next/link";
import { Gem, Shirt, ShieldCheck, CreditCard, ShoppingCart, Truck } from "lucide-react";
import { STORE, whatsappUrl } from "@/lib/store";

export const metadata: Metadata = {
    title: "Quem Somos",
    description:
        "A MARQUEZ é uma marca forte, feita para homens que buscam estilo, conforto e qualidade em cada detalhe.",
};

const PILLARS = [
    { Icon: Gem, title: "Alta Qualidade" },
    { Icon: Shirt, title: "Estilo Moderno" },
    { Icon: ShieldCheck, title: "Compra Segura" },
    { Icon: CreditCard, title: "Diversas Formas de Pagamento" },
];

export default function SobrePage() {
    return (
        <div className="pt-32 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <section className="text-center">
                <img src="/logo-dark.png" alt="MARQUEZ" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 rounded-full" />
                <span className="text-[11px] tracking-[0.5em] uppercase text-zinc-400 block mb-6">Roupas Masculinas</span>
                <h1 className="font-display font-extrabold uppercase text-white leading-[0.95] tracking-wide">
                    <span className="block text-3xl sm:text-5xl">Qualidade que veste</span>
                    <span className="block text-4xl sm:text-7xl italic mt-2 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        com atitude
                    </span>
                </h1>
                <div className="w-24 h-px bg-white/30 mx-auto my-10" aria-hidden />
                <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                    A <strong className="text-white">MARQUEZ</strong> é uma marca forte, feita para homens que buscam{" "}
                    <strong className="text-white">estilo</strong>, <strong className="text-white">conforto</strong> e{" "}
                    <strong className="text-white">qualidade</strong> em cada detalhe. Nossas roupas são confeccionadas com
                    materiais de <strong className="text-white">alta qualidade</strong>, garantindo durabilidade, caimento
                    perfeito e um visual sempre impecável.
                </p>
            </section>

            <section aria-label="Nossos diferenciais" className="mt-20 grid grid-cols-2 md:grid-cols-4 border border-white/10 divide-x divide-y md:divide-y-0 divide-white/10">
                {PILLARS.map(({ Icon, title }) => (
                    <div key={title} className="flex flex-col items-center text-center gap-3 px-4 py-8">
                        <Icon className="w-8 h-8 text-zinc-200" strokeWidth={1.4} aria-hidden />
                        <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">{title}</h2>
                    </div>
                ))}
            </section>

            <section className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 border border-white/10 bg-[#111114] p-6">
                    <ShoppingCart className="w-10 h-10 text-zinc-200 flex-shrink-0" strokeWidth={1.4} aria-hidden />
                    <div>
                        <h2 className="font-display font-bold uppercase tracking-wider text-white text-lg">Loja Virtual</h2>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Com facilidade de compra</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 border border-white/10 bg-[#111114] p-6">
                    <Truck className="w-10 h-10 text-zinc-200 flex-shrink-0" strokeWidth={1.4} aria-hidden />
                    <div>
                        <h2 className="font-display font-bold uppercase tracking-wider text-white text-lg">Envio para Todo o Brasil</h2>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Código de rastreio em todos os pedidos</p>
                    </div>
                </div>
            </section>

            <section className="mt-20 text-center border-t border-white/10 pt-16">
                <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wider text-white">
                    MARQUEZ, mais que uma loja,<br /> uma marca de confiança.
                </h2>
                <p className="text-[11px] tracking-[0.4em] uppercase text-zinc-500 mt-4">Vista o melhor. Escolha MARQUEZ.</p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/loja" className="bg-white text-black px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all">
                        Ver Coleção
                    </Link>
                    <a
                        href={`https://instagram.com/${STORE.instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
                    >
                        @{STORE.instagramHandle}
                    </a>
                    <a
                        href={whatsappUrl("Olá! Vim pela página Quem Somos e gostaria de falar com a MARQUEZ.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/30 text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
                    >
                        WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}
