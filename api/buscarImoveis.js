// /api/buscarImoveis.js
export default async function handler(req, res) {
  const { endereco, tipo, area, quartos, banheiros, vagas } = req.body;

  const query = `imóvel ${tipo} ${quartos} quartos ${banheiros} banheiros ${vagas} vagas ${area}m² ${endereco}`;

  try {
    const resposta = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(query)}`
    );

    const resultado = await resposta.json();

    if (!resultado.items) {
      return res.status(200).json([]);
    }

    const imoveis = resultado.items.slice(0, 10).map((item) => {
      const link = item.link;
      const titulo = item.title;

      // Tenta extrair valor e metragem do título (ex: "Apartamento 80m2 R$ 450.000")
      const areaMatch = titulo.match(/(\d{2,3})\s?m²?/i);
      const valorMatch = titulo.match(/R\$\s?(\d{2,3}[\.\d]*)/i);

      const area = areaMatch ? parseInt(areaMatch[1]) : undefined;
      const valor = valorMatch ? parseInt(valorMatch[1].replace(/\./g, "")) : undefined;

      return {
        area,
        valor,
        link,
      };
    });

    res.status(200).json(imoveis);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar imóveis: " + error.message });
  }
}
