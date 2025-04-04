import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { comprador, vendedor, endereco, valor, formaPagamento, observacoes } = req.body;

  try {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="proposta_house55.pdf"',
        'Content-Length': pdfData.length
      });
      res.end(pdfData);
    });

    doc.fontSize(18).fillColor('#000').text('Proposta de Compra - House55', { align: 'center' });

    doc.moveDown(2);
    doc.fontSize(12).text(`🧑 Comprador: ${comprador}`);
    doc.text(`🏠 Vendedor: ${vendedor}`);
    doc.text(`📍 Imóvel: ${endereco}`);
    doc.text(`💰 Valor da proposta: R$ ${Number(valor).toLocaleString('pt-BR')}`);
    doc.text(`💳 Forma de pagamento: ${formaPagamento}`);
    if (observacoes && observacoes.trim() !== '') {
      doc.text(`📝 Observações: ${observacoes}`);
    }

    doc.moveDown(2);
    doc.text('_________________________', 100);
    doc.text('Assinatura do Comprador', 100);
    doc.text('_________________________', 350);
    doc.text('Assinatura do Vendedor', 350);

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ erro: 'Erro ao gerar PDF' });
  }
}
