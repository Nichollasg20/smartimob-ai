export default async function handler(req, res) {
  const { query } = req.body;

  try {
    const googleResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`,
      {
        method: "GET",
      }
    );

    const data = await googleResponse.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const resultados = data.items?.map((item) => ({
      titulo: item.title,
      link: item.link,
      snippet: item.snippet,
    })) || [];

    return res.status(200).json({ resultados });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dados no Google." });
  }
}
export default async function handler(req, res) {
  const { query } = req.body;

  try {
    const googleResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`,
      {
        method: "GET",
      }
    );

    const data = await googleResponse.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const resultados = data.items?.map((item) => ({
      titulo: item.title,
      link: item.link,
      snippet: item.snippet,
    })) || [];

    return res.status(200).json({ resultados });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dados no Google." });
  }
}
