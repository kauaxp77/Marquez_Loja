import Link from "next/link";

export default function NotFound() {
    return (
        <div className="pt-40 pb-32 px-4 text-center max-w-md mx-auto flex-grow">
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 block mb-3">Erro 404</span>
            <h1 className="text-3xl font-bold font-display tracking-widest uppercase text-white mb-4">Página não encontrada</h1>
            <p className="text-xs text-zinc-400 mb-10 leading-relaxed">
                O endereço pode ter mudado ou a peça saiu do catálogo. Que tal ver a coleção atual?
            </p>
            <Link href="/loja" className="inline-block bg-white text-black px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-colors">
                Ver Coleção
            </Link>
        </div>
    );
}
