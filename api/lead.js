export default async function handler(req, res) {
  const { resumo, canal, resultado } = req.body;

  const prompt = `
  Um cliente foi atendido via ${canal} e não fechou negócio. 
  Aqui está o resumo do atendimento: "${resumo}".
  Resultado: ${resultado}.
  Analise o que pode ter dado errado e dê sugestões para um próximo atendimento.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
