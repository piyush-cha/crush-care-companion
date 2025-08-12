import { CONFIG, LanguageCode } from "@/config";

export async function transcribeWebmBase64(
  audioBase64: string,
  language: LanguageCode
): Promise<string> {
  if (!CONFIG.GOOGLE_SPEECH_API_KEY) {
    return ""; // Gracefully fallback to empty transcript
  }

  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${CONFIG.GOOGLE_SPEECH_API_KEY}`;
  const body = {
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: language,
      enableAutomaticPunctuation: true,
    },
    audio: { content: audioBase64 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`STT error: ${res.status} ${t}`);
  }

  const data = await res.json();
  const transcript = data?.results?.[0]?.alternatives?.[0]?.transcript || "";
  return transcript;
}
