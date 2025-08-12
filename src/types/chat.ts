import { LanguageCode } from "@/config";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  language: LanguageCode;
  memeUrl?: string;
  recipeName?: string;
  timestamp: number;
}
