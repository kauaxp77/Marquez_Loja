import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Se uma foto de produto não carregar (ex.: link externo fora do ar), mostra uma imagem neutra da marca
// no lugar do ícone de imagem quebrada. Roda antes da hidratação para pegar também os erros iniciais.
const IMAGE_FALLBACK_SCRIPT = `window.addEventListener("error", function (e) {
  var img = e.target;
  if (img && img.tagName === "IMG" && !img.dataset.fallback) {
    img.dataset.fallback = "1";
    img.src = "/sem-foto.svg";
  }
}, true);`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://marquez-ecom.vercel.app"),
  title: {
    default: "MARQUEZ | Roupas Masculinas",
    template: "%s | MARQUEZ",
  },
  description:
    "MARQUEZ: roupas masculinas com estilo, conforto e qualidade em cada detalhe. Envio para todo o Brasil, pedido direto pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MARQUEZ",
    title: "MARQUEZ | Roupas Masculinas",
    description: "Qualidade que veste com atitude. Vista o melhor. Escolha MARQUEZ.",
    images: ["/logo-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${syne.variable} antialiased h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: IMAGE_FALLBACK_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#09090b] text-white selection:bg-white selection:text-black">
        <CartProvider>
          <Header />
          <main id="conteudo" className="flex-grow flex flex-col">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
