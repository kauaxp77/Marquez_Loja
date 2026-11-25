import type { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marquez-ecom.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ["", "/loja", "/sobre", "/trocas", "/privacidade"].map((path) => ({
        url: `${SITE_URL}${path}`,
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.7,
    }));
    const products = MOCK_PRODUCTS.map((p) => ({
        url: `${SITE_URL}/produto/${p.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));
    return [...pages, ...products];
}
