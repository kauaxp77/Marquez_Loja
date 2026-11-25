import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { STORE, whatsappUrl } from "@/lib/store";

export const metadata: Metadata = {
    title: "Trocas e Devoluções",
    description: "Como trocar ou devolver um produto MARQUEZ.",
};

// TEXTO-MODELO: revisar prazos e condições com a MARQUEZ antes da publicação oficial.
export default function TrocasPage() {
    return (
        <InfoPage eyebrow="Atendimento" title="Trocas e Devoluções">
            <p>
                Queremos que você vista MARQUEZ com total confiança. Se a peça não serviu ou não era o que você esperava,
                a gente resolve.
            </p>

            <h2>Primeira troca grátis</h2>
            <ul>
                <li>A primeira troca de cada pedido é grátis, em até <strong>30 dias</strong> após o recebimento.</li>
                <li>Troque por outro tamanho, cor ou modelo, sujeito à disponibilidade em estoque.</li>
                <li>A peça deve estar sem uso, sem lavagem e com a etiqueta.</li>
            </ul>

            <h2>Direito de arrependimento</h2>
            <p>
                Compras feitas pela internet podem ser devolvidas em até <strong>7 dias corridos</strong> após o recebimento,
                conforme o art. 49 do Código de Defesa do Consumidor. O valor pago, incluindo o frete, é reembolsado
                integralmente pela mesma forma de pagamento.
            </p>

            <h2>Defeito de fabricação</h2>
            <p>
                Identificou algum defeito? Fale com a gente em até 90 dias após o recebimento. Fazemos a troca ou o reembolso
                sem custo para você.
            </p>

            <h2>Como solicitar</h2>
            <p>
                Chame no WhatsApp{" "}
                <a href={whatsappUrl("Olá! Quero solicitar uma troca/devolução do meu pedido.")} target="_blank" rel="noopener noreferrer" className="underline text-white">
                    {STORE.whatsappDisplay}
                </a>{" "}
                com o nome usado no pedido e o motivo. Enviamos as instruções de postagem em seguida.
            </p>
        </InfoPage>
    );
}
