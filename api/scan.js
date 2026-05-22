import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { image } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Est-ce un panneau ? Réponds uniquement en JSON: { \"isSign\": true, \"signType\": \"nom\" }",
      { inlineData: { data: image, mimeType: "image/jpeg" } }
    ]);

    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    res.status(200).json(JSON.parse(jsonMatch[0]));
  } catch (e) {
    res.status(500).json({ error: "Erreur IA" });
  }
}
