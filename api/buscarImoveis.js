// Arquivo: /api/buscarlimoveis.js

export default async function handler(req, res) {
  const { endereco, tipo, area, quartos, banheiros, vagas } = req.body;

  const query = `${tipo} ${quartos} quartos ${banheiros} banheiros ${vagas} garagem ${area}m² ${endereco}`;

  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!data.items) {
      return res.status(200).json({ links: [] });
    }

    const links = data.items.map(item => ({
      title: item.title,
      link: item.link
    }));

    return res.status(200).json({ links });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar imóveis." });
  }
}
