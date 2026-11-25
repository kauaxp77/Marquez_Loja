import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Moldura das páginas institucionais (quem somos, trocas, privacidade).
export function InfoPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
    return (
        <div className="pt-32 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white uppercase tracking-widest mb-10 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Início
            </Link>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-2">{eyebrow}</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-wider text-white uppercase mb-10">{title}</h1>
            <div className="space-y-6 text-sm text-zinc-300 leading-relaxed [&_h2]:text-white [&_h2]:text-xs [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[0.2em] [&_h2]:pt-6 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-white">
                {children}
            </div>
        </div>
    );
}
