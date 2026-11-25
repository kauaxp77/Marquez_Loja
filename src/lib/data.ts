export type Size = "P" | "M" | "G" | "GG" | "XG" | "U";

export const ALL_SIZES: Size[] = ["P", "M", "G", "GG", "XG", "U"];

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    // Itens de "Composição e Detalhes" na página do produto.
    details: string[];
    price: number;
    promotionalPrice?: number;
    category: string;
    images: string[];
    sizes: Size[];
    // Unidades disponíveis do produto (somando todos os tamanhos). 0 = esgotado.
    stock: number;
    featured: boolean;
    newProduct: boolean;
    createdAt: string;
}

export const CATEGORIES = [
    "Camisetas",
    "Calças",
    "Conjuntos",
    "Moletons",
    "Jaquetas",
    "Acessórios",
];

// ITENS DEMONSTRATIVOS: serão substituídos pelas fotos, medidas e preços oficiais enviados pela MARQUEZ.
export const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Camiseta Oversized Midnight",
        slug: "camiseta-oversized-midnight",
        description: "Camiseta com caimento oversized em algodão pima. Minimalista, essencial e atemporal.",
        details: [
            "100% algodão pima penteado, gramatura pesada (240g/m²).",
            "Gola canelada de 3cm com pesponto duplo reforçado.",
            "Pré-encolhida: mantém o caimento após a lavagem.",
        ],
        price: 189.9,
        category: "Camisetas",
        images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80"],
        sizes: ["P", "M", "G", "GG"],
        stock: 50,
        featured: true,
        newProduct: true,
        createdAt: "2026-09-01T00:00:00Z"
    },
    {
        id: "p2",
        name: "Calça Cargo Street Graphite",
        slug: "calca-cargo-street-graphite",
        description: "Calça cargo premium em sarja de alta gramatura. Bolsos utilitários e modelagem reta.",
        details: [
            "Sarja 98% algodão e 2% elastano.",
            "Seis bolsos, sendo dois laterais utilitários com lapela.",
            "Barra com regulagem por cordão.",
        ],
        price: 349.9,
        category: "Calças",
        images: ["https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=800&q=80", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
        sizes: ["M", "G", "GG"],
        stock: 20,
        featured: true,
        newProduct: false,
        createdAt: "2026-08-15T00:00:00Z"
    },
    {
        id: "p3",
        name: "Jaqueta de Couro Essential",
        slug: "jaqueta-de-couro-essential",
        description: "Jaqueta de couro eco. A peça que transforma qualquer look em uma super produção.",
        details: [
            "Couro ecológico com toque macio e forro em poliéster.",
            "Zíper frontal metálico e dois bolsos laterais.",
            "Punhos e barra com acabamento ajustado.",
        ],
        price: 599.9,
        promotionalPrice: 499.9,
        category: "Jaquetas",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80"],
        sizes: ["P", "M", "G", "GG"],
        stock: 12,
        featured: true,
        newProduct: false,
        createdAt: "2026-07-20T00:00:00Z"
    },
    {
        id: "p4",
        name: "Camiseta Essential White",
        slug: "camiseta-essential-white",
        description: "Camiseta de corte reto em malha encorpada. A base de qualquer guarda-roupa.",
        details: [
            "100% algodão penteado (200g/m²).",
            "Modelagem regular com ombro estruturado.",
        ],
        price: 139.9,
        category: "Camisetas",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"],
        sizes: ["P", "M", "G", "GG", "XG"],
        stock: 40,
        featured: false,
        newProduct: true,
        createdAt: "2026-10-10T00:00:00Z"
    },
    {
        id: "p5",
        name: "Calça Alfaiataria Slim Noir",
        slug: "calca-alfaiataria-slim-noir",
        description: "Calça de alfaiataria com modelagem slim e cintura com passantes. Do escritório à noite.",
        details: [
            "Tecido em viscose com elastano, caimento fluido.",
            "Fechamento por zíper e botão de pressão.",
        ],
        price: 299.9,
        category: "Calças",
        images: ["https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"],
        sizes: ["P", "M", "G", "GG"],
        stock: 3,
        featured: false,
        newProduct: false,
        createdAt: "2026-06-05T00:00:00Z"
    },
    {
        id: "p6",
        name: "Conjunto Linho Sky",
        slug: "conjunto-linho-sky",
        description: "Camisa e calça em linho leve. Conjunto pensado para os dias quentes com elegância.",
        details: [
            "Linho misto (55% linho, 45% viscose).",
            "Camisa de manga longa e calça com cós elástico.",
            "Vendido como conjunto, mesmo tamanho nas duas peças.",
        ],
        price: 459.9,
        promotionalPrice: 399.9,
        category: "Conjuntos",
        images: ["https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800&q=80", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
        sizes: ["M", "G", "GG"],
        stock: 8,
        featured: true,
        newProduct: true,
        createdAt: "2026-10-28T00:00:00Z"
    },
    {
        id: "p7",
        name: "Moletom Heavy Stone",
        slug: "moletom-heavy-stone",
        description: "Moletom com capuz em felpa pesada, bolso canguru e punhos canelados.",
        details: [
            "Moletom 3 cabos peluciado, 50% algodão e 50% poliéster.",
            "Capuz forrado com cordão e ponteiras metálicas.",
        ],
        price: 279.9,
        category: "Moletons",
        images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"],
        sizes: ["P", "M", "G", "GG", "XG"],
        stock: 25,
        featured: false,
        newProduct: false,
        createdAt: "2026-05-18T00:00:00Z"
    },
    {
        id: "p8",
        name: "Jaqueta Bomber Rust",
        slug: "jaqueta-bomber-rust",
        description: "Bomber em nylon acetinado com forro matelassê. Leve, quente e urbana.",
        details: [
            "Nylon acetinado com forro matelassê.",
            "Gola, punhos e barra em ribana.",
        ],
        price: 429.9,
        category: "Jaquetas",
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
        sizes: ["M", "G", "GG"],
        stock: 0,
        featured: false,
        newProduct: false,
        createdAt: "2026-04-02T00:00:00Z"
    },
    {
        id: "p9",
        name: "Boné Dad Hat Stone",
        slug: "bone-dad-hat-stone",
        description: "Boné de aba curva em sarja lavada, bordado MARQUEZ frontal e regulagem metálica.",
        details: [
            "Sarja 100% algodão lavada.",
            "Regulagem traseira com fivela metálica. Tamanho único.",
        ],
        price: 119.9,
        category: "Acessórios",
        images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80"],
        sizes: ["U"],
        stock: 30,
        featured: false,
        newProduct: true,
        createdAt: "2026-11-05T00:00:00Z"
    },
];

export function getProductById(id: string): Product | undefined {
    return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getFinalPrice(product: Product): number {
    return product.promotionalPrice ?? product.price;
}

export function getDiscountPercent(product: Product): number | null {
    if (!product.promotionalPrice || product.promotionalPrice >= product.price) return null;
    return Math.round((1 - product.promotionalPrice / product.price) * 100);
}
