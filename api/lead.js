export default async function handler(req, res) {
  try {
    const { canal, resumo, resultado } = req.body;

    const prompt = `
      Você é um especialista em vendas de imóveis. Analise esse atendimento:

      Canal: ${canal}
      Resumo do atendimento: ${resumo}
      Resultado: ${resultado}

      Me diga por que o cliente não fechou, e como o corretor pode melhorar a abordagem nos próximos contatos.
    `;

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

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro interno no servidor" });
  }
}
