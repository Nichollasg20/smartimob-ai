export default async function handler(req, res) {
  const { endereco, tipo, area, quartos, banheiros, vagas } = req.body;

  const query = `site:olx.com.br OR site:imovelweb.com.br OR site:vivareal.com.br OR site:zapimoveis.com.br apartamento ${area}m² ${quartos} quartos ${banheiros} banheiros ${vagas} vagas ${endereco}`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${process.env.GOOGLE_CX}&key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await response.json();

    const links = (data.items || []).filter(item => item.link.includes("imovel") || item.link.includes("apartamento")).slice(0, 10);

    const similares = links.map(item => ({
      area: undefined, // será melhorado no scraping futuro
      valor: undefined, // idem
      link: item.link
    }));

    res.status(200).json(similares);
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro ao buscar imóveis semelhantes." });
  }
}
