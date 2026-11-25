// Configuração comercial da loja: um só lugar para contato, frete, parcelamento e formatação de preços.
// Alterar aqui atualiza produto, sacola, checkout, rodapé e botão flutuante ao mesmo tempo.

export const STORE = {
    // Número do WhatsApp comercial, só dígitos, com DDI 55 + DDD.
    whatsappNumber: "5561991774178",
    whatsappDisplay: "(61) 99177-4178",
    instagramHandle: "otl_marquez",
    pixKey: "wendesonkaua11@gmail.com",
    pixKeyType: "E-mail",
};

// Frete grátis vale para o PAC a partir deste subtotal. SEDEX é sempre cobrado.
export const FREE_SHIPPING_THRESHOLD = 350;

export const MAX_INSTALLMENTS = 3;

export type ShippingId = "pac" | "sedex";

export interface ShippingOption {
    id: ShippingId;
    name: string;
    deadline: string;
    price: number;
}

export function getShippingOptions(subtotal: number): ShippingOption[] {
    const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
    return [
        { id: "pac", name: "PAC", deadline: "5 a 7 dias úteis", price: isFree ? 0 : 22.9 },
        { id: "sedex", name: "SEDEX", deadline: "2 a 3 dias úteis", price: 38.5 },
    ];
}

// Soma em centavos para evitar erros de ponto flutuante (ex.: 0,1 + 0,2).
export function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number): string {
    // Intl usa espaço não separável entre "R$" e o número; troca por espaço comum para mensagens de texto.
    return brl.format(roundMoney(value)).replace(/ /g, " ");
}

export function formatInstallment(value: number): string {
    return `${MAX_INSTALLMENTS}x de ${formatPrice(value / MAX_INSTALLMENTS)}`;
}

export function whatsappUrl(text?: string): string {
    const base = `https://wa.me/${STORE.whatsappNumber}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// "Calças" -> "calcas": usado na URL (?categoria=) e na comparação de filtros.
export function slugify(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
}
