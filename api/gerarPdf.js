import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Método não permitido');
  }

  try {
    const { comprador, vendedor, endereco, valor, formaPagamento, observacoes } = req.body;

    const doc = new PDFDocument();
    const stream = new PassThrough();

    res.setHeader('Content-Disposition', 'attachment; filename="proposta_house55.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(stream);

    doc.fontSize(18).fillColor('#000').text('📄 Proposta de Compra - House55', { align: 'center' });
    doc.moveDown();

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
    stream.pipe(res);
  } catch (err) {
    console.error('Erro ao gerar o PDF:', err);
    res.status(500).json({ error: 'Erro ao gerar o PDF' });
  }
}
