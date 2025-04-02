export default async function handler(req, res) {
  const { canal, resumo, resultado } = req.body;

  const prompt = `
Você é um especialista em vendas de imóveis. Um corretor fez o seguinte atendimento:

Canal de atendimento: ${canal}
Resumo do atendimento: ${resumo}
Resultado: ${resultado}

Analise o atendimento, identifique o que pode ter dado errado, e dê sugestões práticas e profissionais para um próximo contato com esse cliente ou com outros similares. Seja direto, respeitoso e objetivo.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao se conectar com a OpenAI." });
  }
}
