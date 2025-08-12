# Crush Care AI

An AI-powered, frontend-only web app that helps reduce anxiety with friendly conversations, memes, fun activities, and quick recipes — in both Hindi and English.

Live stack: React + Vite + TypeScript + Material UI. No backend required.

## Features
- Gemini chatbot replies (Google Generative Language API)
- Speech-to-Text (Google Cloud Speech-to-Text) for English and Hindi
- Text-to-Speech (Google Cloud Text-to-Speech)
- Meme fetch from meme-api.com
- Random quick recipe from TheMealDB
- Chat-style UI with timestamps, emoji-friendly responses
- Light/Dark mode
- Fully responsive, mobile-friendly

## Quick Start
1. Install dependencies
   ```bash
   npm i
   ```
2. Add API keys in `src/config.ts` (see security note there):
   ```ts
   export const CONFIG = {
     GEMINI_API_KEY: "YOUR_GEMINI_KEY",
     GOOGLE_SPEECH_API_KEY: "YOUR_SPEECH_KEY",
     GOOGLE_TTS_API_KEY: "YOUR_TTS_KEY",
   } as const;
   ```
   IMPORTANT: Restrict keys by HTTP referrer (your domain) and enable only the APIs you use.
3. Run the app
   ```bash
   npm run dev
   ```

## Google Cloud Setup
1. Create a GCP project (https://console.cloud.google.com/)
2. Enable these APIs:
   - Generative Language API (Gemini)
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
3. Create API keys and restrict by HTTP referrer
4. Paste keys into `src/config.ts`

## Notes on Frontend-only Keys
- These keys are exposed in the browser. Always restrict by domain.
- Consider regenerating keys if they leak.

## Deployment
Deploy to Vercel or Netlify. The app is a pure SPA — just build and host.

- Vercel
  - Import repo, set framework to Vite
- Netlify
  - Build command: `npm run build`
  - Publish directory: `dist`

## Accessibility & Performance
- Images are lazy-loaded
- Visible focus states
- Mobile-first, responsive layout

## License
MIT
