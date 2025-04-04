import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { corretor, comprador, vendedor, endereco, valor, pagamento, observacoes } = req.body;

  const doc = new jsPDF();

  // Logo da House55 (use a URL da logo como base)
  const logoURL = "https://i.imgur.com/YY4M4YM.png";
  const logoBase64 = await fetch(logoURL).then(res => res.arrayBuffer()).then(buf => {
    return Buffer.from(buf).toString('base64');
  });

  doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 15, 10, 40, 20);

  doc.setFontSize(18);
  doc.setTextColor(160, 118, 40);
  doc.text("Proposta de Compra de Imóvel", 105, 30, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 50;

  doc.text(`🧑 Corretor: ${corretor}`, 15, y);
  y += 10;
  doc.text(`🏠 Vendedor: ${vendedor}`, 15, y);
  y += 10;
  doc.text(`🛒 Comprador: ${comprador}`, 15, y);
  y += 10;
  doc.text(`📍 Endereço do Imóvel: ${endereco}`, 15, y);
  y += 10;
  doc.text(`💰 Valor da Proposta: R$ ${parseFloat(valor).toLocaleString('pt-BR')}`, 15, y);
  y += 10;
  doc.text(`💳 Forma de Pagamento: ${pagamento}`, 15, y);
  y += 10;

  if (observacoes && observacoes.trim() !== "") {
    doc.text("📝 Observações:", 15, y);
    y += 8;
    const splitText = doc.splitTextToSize(observacoes, 180);
    doc.text(splitText, 15, y);
  }

  // Final
  y += 30;
  doc.setFontSize(10);
  doc.text("Esta proposta não substitui o contrato definitivo de compra e venda.", 15, y);
  y += 10;
  doc.text("Data: " + new Date().toLocaleDateString("pt-BR"), 15, y);

  const pdf = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=proposta_house55.pdf");
  res.send(Buffer.from(pdf));
}
