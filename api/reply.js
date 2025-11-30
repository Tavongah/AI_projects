import OpenAI from "openai";

export default async function handler(req, res) {
  const { message, business } = req.query;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
  You are replying as ${business || "this business"}.
  Keep replies friendly, helpful, and under 100 words.
  
  Customer question: "${message}"
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
