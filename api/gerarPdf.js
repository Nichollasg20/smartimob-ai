// /api/gerarPdf.js
import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { comprador, vendedor, endereco, valor, pagamento, observacoes } = req.body;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(169, 125, 54);
  doc.text("Proposta de Compra - House55", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Comprador: ${comprador}`, 20, 40);
  doc.text(`Vendedor: ${vendedor}`, 20, 50);
  doc.text(`Endereço do Imóvel: ${endereco}`, 20, 60);
  doc.text(`Valor da Proposta: ${valor}`, 20, 70);
  doc.text(`Forma de Pagamento: ${pagamento}`, 20, 80);

  if (observacoes) {
    doc.text("Observações:", 20, 90);
    const lines = doc.splitTextToSize(observacoes, 170);
    doc.text(lines, 20, 96);
  }

  // Espaço para assinatura
  const y = observacoes ? 120 + doc.splitTextToSize(observacoes, 170).length * 6 : 110;
  doc.text("____________________________________", 20, y + 30);
  doc.text("Assinatura do Comprador", 20, y + 37);

  doc.text("____________________________________", 120, y + 30);
  doc.text("Assinatura do Vendedor", 120, y + 37);

  const pdf = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=proposta_house55.pdf");
  res.send(Buffer.from(pdf));
}
