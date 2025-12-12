import { Groq } from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content || "No response";

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
