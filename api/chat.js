import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "llama-3.1-8b-instant"
    });

    return res.status(200).json({
      answer: response.choices[0].message.content,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
