import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah asisten Islami yang sholeh yang membantu menjawab pertanyaan tentang Al-Qur'an, doa, dan ibadah dengan bahasa ala GEN Z namun sopan dan sesuai syariat.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 512,
          temperature: 0.2,
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      return res.status(500).json({ error: "Groq API error" });
    }

    const data = await groqRes.json();
    const content =
    data?.choices?.[0]?.message?.content ??
    "Maaf, saya belum bisa menjawab saat ini.";

return res.status(200).json({ reply: content });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
