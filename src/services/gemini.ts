import { CONFIG, LanguageCode } from "@/config";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export async function generateGeminiReply(
  userText: string,
  language: LanguageCode
): Promise<string> {
  if (!CONFIG.GEMINI_API_KEY) {
    return "Please add your Gemini API key in config.ts to receive AI replies.";
  }

  const prompt = `You are Crush Care AI, a warm, funny, empathetic companion that helps reduce anxiety.\n\nTask:\n- Reply in ${language === "hi-IN" ? "Hindi" : "English"}\n- 2–4 short, friendly sentences with emojis.\n- Acknowledge feelings, suggest a simple grounding tip.\n- Be kind and encouraging.\n\nUser said: "${userText}"`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(`${GEMINI_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error: ${res.status} ${t}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    (language === "hi-IN"
      ? "क्षमा करें, मैं अभी उत्तर नहीं दे पा रहा/रही हूँ।"
      : "Sorry, I can't reply right now.");
  return text;
}
