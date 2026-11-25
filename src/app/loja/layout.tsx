import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Loja",
    description: "Catálogo MARQUEZ: camisetas, calças, conjuntos, moletons, jaquetas e acessórios masculinos.",
};

export default function LojaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
