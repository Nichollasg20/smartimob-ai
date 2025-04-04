import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { corretor, comprador, vendedor, imovel, valor, condicoes } = req.body;

  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");

  // Título
  doc.setFontSize(18);
  doc.setTextColor(169, 125, 54);
  doc.text("Proposta de Compra - House55", 105, 20, { align: "center" });

  // Dados principais
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 35;

  doc.text(`Corretor: ${corretor}`, 20, y);
  y += 10;
  doc.text(`Comprador: ${comprador}`, 20, y);
  y += 10;
  doc.text(`Vendedor: ${vendedor}`, 20, y);
  y += 15;

  doc.setFont(undefined, "bold");
  doc.text("Descrição do Imóvel:", 20, y);
  doc.setFont(undefined, "normal");
  y += 8;
  const imovelLines = doc.splitTextToSize(imovel, 170);
  doc.text(imovelLines, 20, y);
  y += imovelLines.length * 7;

  doc.setFont(undefined, "bold");
  doc.text(`Valor da Proposta: R$ ${parseFloat(valor).toLocaleString("pt-BR")}`, 20, y);
  y += 15;

  doc.setFont(undefined, "bold");
  doc.text("Condições de Pagamento:", 20, y);
  doc.setFont(undefined, "normal");
  y += 8;
  const condicoesLines = doc.splitTextToSize(condicoes, 170);
  doc.text(condicoesLines, 20, y);
  y += condicoesLines.length * 7 + 10;

  // Espaço para assinatura
  doc.setFont(undefined, "bold");
  doc.text("Assinaturas:", 20, y);
  y += 20;
  doc.line(20, y, 90, y); doc.text("Comprador", 20, y + 6);
  doc.line(120, y, 190, y); doc.text("Vendedor", 120, y + 6);

  // Finaliza
  const pdf = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=proposta_house55.pdf");
  res.send(Buffer.from(pdf));
}
