export type Size = "P" | "M" | "G" | "GG" | "XG" | "U";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    promotionalPrice?: number;
    category: string;
    images: string[];
    sizes: Size[];
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

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Camiseta Oversized Midnight",
        slug: "camiseta-oversized-midnight",
        description: "Camiseta com caimento oversized em algodão pima. Minimalista, essencial e atemporal.",
        price: 189.9,
        category: "Camisetas",
        images: ["https://images.unsplash.com/photo-1618517351616-389a1c6a6f69?w=800&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"],
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
        price: 349.9,
        category: "Calças",
        images: ["https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80", "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=800&q=80"],
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
        price: 599.9,
        promotionalPrice: 499.9,
        category: "Jaquetas",
        images: ["https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80", "https://images.unsplash.com/photo-1521223830114-56920676717a?w=800&q=80"],
        sizes: ["P", "M", "G", "GG"],
        stock: 12,
        featured: true,
        newProduct: false,
        createdAt: "2026-07-20T00:00:00Z"
    }
];
