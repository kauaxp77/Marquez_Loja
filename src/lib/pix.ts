// Gera o "Pix copia e cola" (BR Code estático do Banco Central) com chave e valor.
// O mesmo texto vira o QR Code: qualquer app de banco lê e já preenche o valor.

function field(id: string, value: string): string {
    return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

// CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido no campo 63.
function crc16(payload: string): string {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let bit = 0; bit < 8; bit++) {
            crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Nome e cidade só aceitam letras sem acento, números e espaço.
function clean(text: string, max: number): string {
    return text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9 ]/g, "")
        .toUpperCase()
        .trim()
        .slice(0, max);
}

export function buildPixPayload({
    key,
    amount,
    merchantName,
    merchantCity,
    txid = "***",
}: {
    key: string;
    amount: number;
    merchantName: string;
    merchantCity: string;
    txid?: string;
}): string {
    const account = field("00", "br.gov.bcb.pix") + field("01", key);
    const payload =
        field("00", "01") +
        field("26", account) +
        field("52", "0000") +
        field("53", "986") +
        field("54", amount.toFixed(2)) +
        field("58", "BR") +
        field("59", clean(merchantName, 25)) +
        field("60", clean(merchantCity, 15)) +
        field("62", field("05", txid)) +
        "6304";
    return payload + crc16(payload);
}
