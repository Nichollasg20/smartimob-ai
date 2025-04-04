import PDFDocument from "pdfkit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { comprador, vendedor, endereco, valor, formaPagamento, observacoes } = req.body;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=proposta_house55.pdf");

  const doc = new PDFDocument();
  doc.pipe(res);

  // Cabeçalho
  doc.image("public/logo_house.png", 50, 50, { width: 120 });
  doc.fontSize(18).fillColor("#c59d5f").text("Proposta de Compra - House55", 200, 65);

  // Corpo
  doc.moveDown().fontSize(12).fillColor("black");
  doc.text(`Comprador: ${comprador}`);
  doc.text(`Vendedor: ${vendedor}`);
  doc.text(`Endereço do Imóvel: ${endereco}`);
  doc.text(`Valor da Proposta: R$ ${parseFloat(valor).toLocaleString("pt-BR")}`);
  doc.text(`Forma de Pagamento: ${formaPagamento}`);
  if (observacoes) {
    doc.text(`Observações: ${observacoes}`);
  }

  // Assinaturas
  doc.moveDown(2);
  doc.text("____________________________________", { align: "left" });
  doc.text("Assinatura do Comprador", { align: "left" });

  doc.moveDown();
  doc.text("____________________________________", { align: "left" });
  doc.text("Assinatura do Vendedor", { align: "left" });

  // Rodapé
  doc.moveDown(2);
  doc.fontSize(10).fillColor("gray");
  doc.text("House55 - Soluções Imobiliárias", { align: "center" });

  doc.end();
}
