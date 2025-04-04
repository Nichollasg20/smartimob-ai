import PDFDocument from "pdfkit";
import getStream from "get-stream";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Método não permitido");
  }

  const { comprador, vendedor, endereco, valor, formaPagamento, observacoes } = req.body;

  try {
    const doc = new PDFDocument({ margin: 50 });
    
    // Cabeçalho
    doc.fontSize(20).fillColor("#a97d36").text("Proposta de Compra - House55", { align: "center" });
    doc.moveDown();

    // Seções da proposta
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`📍 Imóvel: ${endereco}`, { align: "left" })
      .moveDown(0.5)
      .text(`🤝 Vendedor: ${vendedor}`)
      .text(`🧑‍💼 Comprador: ${comprador}`)
      .moveDown(0.5)
      .text(`💰 Valor da Proposta: R$ ${Number(valor).toLocaleString("pt-BR")}`)
      .text(`💳 Forma de Pagamento: ${formaPagamento}`)
      .moveDown(0.5);

    if (observacoes && observacoes.trim() !== "") {
      doc.text(`📝 Observações: ${observacoes}`);
    }

    doc.moveDown(2);

    // Assinaturas
    doc.text("_____________________________", 70, doc.y);
    doc.text("Assinatura do Vendedor", 70, doc.y + 15);

    doc.text("_____________________________", 350, doc.y - 15);
    doc.text("Assinatura do Comprador", 350, doc.y);

    doc.end();

    // Geração e envio do PDF
    const buffer = await getStream.buffer(doc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=proposta_house55.pdf");
    res.send(buffer);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar o PDF");
  }
}
