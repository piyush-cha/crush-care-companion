import { CONFIG, LanguageCode } from "@/config";

const VOICE_BY_LANG: Record<LanguageCode, { languageCode: string; name: string }> = {
  "en-US": { languageCode: "en-US", name: "en-US-Neural2-F" },
  "hi-IN": { languageCode: "hi-IN", name: "hi-IN-Wavenet-A" },
};

export async function synthesizeSpeech(
  text: string,
  language: LanguageCode
): Promise<string> {
  if (!CONFIG.GOOGLE_TTS_API_KEY) {
    throw new Error("Missing Google TTS API key in config.ts");
  }

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${CONFIG.GOOGLE_TTS_API_KEY}`;

  const voice = VOICE_BY_LANG[language];
  const body = {
    input: { text },
    voice: {
      languageCode: voice.languageCode,
      name: voice.name,
    },
    audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`TTS error: ${res.status} ${t}`);
  }

  const data = await res.json();
  return data.audioContent as string; // base64 MP3
}
