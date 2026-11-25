import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS, getFinalPrice } from "@/lib/data";
import { ProductView } from "./ProductView";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) return { title: "Produto não encontrado" };
    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | MARQUEZ`,
            description: product.description,
            images: product.images.slice(0, 1),
        },
    };
}

export default async function ProdutoPage({ params }: Props) {
    const { slug } = await params;
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) notFound();

    // Dados estruturados: permitem ao Google mostrar preço e disponibilidade no resultado de busca.
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        category: product.category,
        brand: { "@type": "Brand", name: "MARQUEZ" },
        offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: getFinalPrice(product).toFixed(2),
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <ProductView product={product} />
        </>
    );
}
