# MARQUEZ — e-commerce de moda masculina

Loja online de roupa masculina: vitrine, catálogo por categoria, página de produto com guia de
tamanhos, carrinho e um checkout que fecha o pedido pelo WhatsApp.

**Não há back-end nem gateway de pagamento.** O catálogo é um arquivo TypeScript e o checkout
monta a mensagem do pedido e abre a conversa com a loja. Para mudar o que está à venda, edite
`src/lib/data.ts` — nada de painel, nada de banco.

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. Para produção, `npm run build` e `npm start`.

## As telas

| Rota | O que é |
|---|---|
| `/` | Vitrine: destaques, lançamentos e as categorias |
| `/loja` | Catálogo completo |
| `/produto/[slug]` | Página do produto: fotos, tamanhos, guia de medidas e o botão do carrinho |
| `/checkout` | Dados do cliente, forma de pagamento (PIX ou combinar) e envio do pedido pelo WhatsApp |

## O catálogo

Cada produto vive em `src/lib/data.ts` com nome, slug, descrição, preço, preço promocional,
categoria, imagens, tamanhos, estoque e as marcas de destaque e lançamento. As categorias são
Camisetas, Calças, Conjuntos, Moletons, Jaquetas e Acessórios.

## Dentro do código

```
src/app/                   as quatro rotas (App Router)
src/components/            Header, Footer, ProductCard, CartDrawer,
                           SizeGuideModal, WhatsAppFloat
src/lib/data.ts            o catálogo e os tipos
src/lib/CartContext.tsx    o carrinho, em contexto React
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion ·
lucide-react. O deploy é na Vercel, sem configuração extra.
