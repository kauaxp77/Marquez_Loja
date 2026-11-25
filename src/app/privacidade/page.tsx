import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { STORE, whatsappUrl } from "@/lib/store";

export const metadata: Metadata = {
    title: "Política de Privacidade",
    description: "Como a MARQUEZ trata os seus dados pessoais.",
};

// TEXTO-MODELO: revisar com a MARQUEZ antes da publicação oficial.
export default function PrivacidadePage() {
    return (
        <InfoPage eyebrow="LGPD" title="Política de Privacidade">
            <p>
                Esta política explica quais dados pessoais a MARQUEZ usa e para quê, de acordo com a Lei Geral de Proteção
                de Dados (Lei nº 13.709/2018).
            </p>

            <h2>O que coletamos</h2>
            <ul>
                <li>
                    <strong>Dados do pedido:</strong> nome, telefone, endereço de entrega e observações que você preenche no
                    checkout.
                </li>
                <li>
                    <strong>Sacola:</strong> os itens escolhidos ficam salvos apenas no seu navegador, para você não perder a
                    seleção. Não usamos cookies de rastreamento nem publicidade.
                </li>
            </ul>

            <h2>Como usamos</h2>
            <p>
                Os dados do checkout não ficam guardados no site: eles formam a mensagem que você mesmo envia para o nosso
                WhatsApp. Usamos essas informações só para confirmar o pedido, calcular o frete, entregar e prestar
                atendimento.
            </p>
            <p>
                Para preencher o endereço automaticamente, o CEP digitado é consultado no serviço público ViaCEP.
            </p>

            <h2>Compartilhamento</h2>
            <p>
                Compartilhamos apenas o necessário com transportadoras (Correios) e meios de pagamento para concluir a
                entrega e o pagamento. Não vendemos dados.
            </p>

            <h2>Seus direitos</h2>
            <p>
                Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo WhatsApp{" "}
                <a href={whatsappUrl("Olá! Tenho uma solicitação sobre meus dados pessoais.")} target="_blank" rel="noopener noreferrer" className="underline text-white">
                    {STORE.whatsappDisplay}
                </a>
                .
            </p>
        </InfoPage>
    );
}
