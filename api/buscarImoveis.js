export default async function handler(req, res) {
  const { endereco, area, quartos, banheiros, tipo } = req.body;

  const searchQuery = `site:olx.com.br OR site:zapimoveis.com.br OR site:vivareal.com.br apartamento ${quartos} quartos ${banheiros} banheiros ${area}m² ${tipo} ${endereco}`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(searchQuery)}`
    );
    const data = await response.json();

    const resultados = (data.items || []).map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    return res.status(200).json({ resultados });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar imóveis semelhantes.' });
  }
}
