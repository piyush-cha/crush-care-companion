// Frontend-only configuration for API keys
// IMPORTANT SECURITY NOTE:
// These keys will be exposed in the browser at runtime. For production, RESTRICT
// your Google API keys by HTTP referrer (your domain) and enable only the
// specific APIs you use. Never grant unrestricted access.
//
// How to use:
// 1) Create/enable the following Google Cloud APIs in your GCP project:
//    - Generative Language API (Gemini)
//    - Cloud Speech-to-Text API
//    - Cloud Text-to-Speech API
// 2) Create API keys and restrict them by HTTP referrer.
// 3) Fill the values below, then run the app.
//
// You can also keep these empty during development to see a friendly warning in the UI.

export type LanguageCode = "en-US" | "hi-IN";

export const CONFIG = {
  GEMINI_API_KEY: "AIzaSyDl-8HEqZVkcHr6JXQ1YQESSEMdzhrHfEM", // Generative Language API (restricted by referrer)
  GOOGLE_SPEECH_API_KEY: "AIzaSyDl-8HEqZVkcHr6JXQ1YQESSEMdzhrHfEM", // Cloud Speech-to-Text
  GOOGLE_TTS_API_KEY: "AIzaSyDl-8HEqZVkcHr6JXQ1YQESSEMdzhrHfEM", // Cloud Text-to-Speech
} as const;

export const DEFAULT_LANGUAGE: LanguageCode = "en-US";
