export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

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
      return res.status(500).json({ error: "Erro ao chamar a OpenAI", details: errorText });
    }

    const data = await response.json();
    const message = data.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor", details: error.message });
  }
}

