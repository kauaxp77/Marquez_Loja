import Link from "next/link";
import { Smartphone } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { STORE, slugify, whatsappUrl } from "@/lib/store";

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

export function Footer() {
    return (
        <footer className="bg-black border-t border-[#1C1C1C] text-[#BFC0C2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                    <div>
                        <Link href="/" className="inline-block mb-6" aria-label="MARQUEZ — página inicial">
                            <img src="/logo-dark.png" alt="MARQUEZ" className="h-16 w-auto rounded-full" />
                        </Link>
                        <p className="text-sm tracking-wide leading-relaxed">
                            Qualidade que veste com atitude.<br />
                            Vista o melhor. Escolha MARQUEZ.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-medium tracking-widest uppercase mb-6 text-sm">Coleções</h3>
                        <ul className="space-y-3 text-sm tracking-wide">
                            {CATEGORIES.map((cat) => (
                                <li key={cat}>
                                    <Link href={`/loja?categoria=${slugify(cat)}`} className="hover:text-white transition-colors">{cat}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium tracking-widest uppercase mb-6 text-sm">MARQUEZ</h3>
                        <ul className="space-y-3 text-sm tracking-wide">
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Quem somos</Link></li>
                            <li><Link href="/loja" className="hover:text-white transition-colors">Loja</Link></li>
                            <li><Link href="/trocas" className="hover:text-white transition-colors">Trocas e devoluções</Link></li>
                            <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de privacidade</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium tracking-widest uppercase mb-6 text-sm">Atendimento</h3>
                        <div className="space-y-4 text-sm tracking-wide">
                            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                                <Smartphone className="w-5 h-5 text-white" aria-hidden />
                                WhatsApp {STORE.whatsappDisplay}
                            </a>
                            <a href={`https://instagram.com/${STORE.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                                <InstagramIcon />
                                @{STORE.instagramHandle}
                            </a>
                            <p className="text-xs text-zinc-500 leading-relaxed">Envio para todo o Brasil · Pix e cartão</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider">
                    <p>© {new Date().getFullYear()} MARQUEZ. Todos os direitos reservados.</p>
                    <p className="opacity-50">Mais que uma loja, uma marca de confiança.</p>
                </div>
            </div>
        </footer>
    );
}
