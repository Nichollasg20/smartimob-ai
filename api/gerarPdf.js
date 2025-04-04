// api/gerarPdf.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { imovel, comparativos } = req.body;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(169, 125, 54);
  doc.text("Apresentação de Avaliação - House55", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Endereço: ${imovel.endereco}`, 14, 30);
  doc.text(`Tipo: ${imovel.tipo} | Estado: ${imovel.estado}`, 14, 38);
  doc.text(`Área: ${imovel.area} m² | Quartos: ${imovel.quartos} | Banheiros: ${imovel.banheiros} | Vagas: ${imovel.vagas}`, 14, 46);

  if (imovel.observacoes) {
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text("Observações:", 14, 54);
    doc.setFontSize(10);
    doc.splitTextToSize(imovel.observacoes, 180).forEach((line, i) => {
      doc.text(line, 14, 60 + i * 6);
    });
  }

  const startY = imovel.observacoes ? 80 : 60;

  autoTable(doc, {
    startY,
    head: [["#", "Área (m²)", "Valor (R$)", "R$/m²", "Link"]],
    body: comparativos.map((c, i) => [
      i + 1,
      c.area,
      `R$ ${c.valor.toLocaleString("pt-BR")}`,
      `R$ ${(c.valor / c.area).toFixed(2)}`,
      c.link
    ]),
    styles: { fontSize: 10, cellWidth: "wrap" },
    columnStyles: { 4: { cellWidth: 70 } }
  });

  const media = comparativos.reduce((sum, c) => sum + c.valor, 0) / comparativos.length;
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 0);
  doc.text(`Valor médio estimado: R$ ${media.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}`, 14, doc.lastAutoTable.finalY + 10);

  const pdf = doc.output("arraybuffer");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=apresentacao_imovel.pdf");
  res.send(Buffer.from(pdf));
}
