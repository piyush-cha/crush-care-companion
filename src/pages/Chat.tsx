import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Container, Stack, Paper, InputBase, Fab, CircularProgress, Select, MenuItem, FormControl, InputLabel, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ChatMessage from "@/components/Chat/ChatMessage";
import { ChatMessage as Message } from "@/types/chat";
import { DEFAULT_LANGUAGE, LanguageCode } from "@/config";
import { generateGeminiReply } from "@/services/gemini";

import { fetchRandomRecipe } from "@/services/recipe";
import { synthesizeSpeech } from "@/services/googleTts";
import { transcribeWebmBase64 } from "@/services/googleStt";
import { ColorModeContext } from "@/theme";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Chat() {
  const colorMode = useContext(ColorModeContext);

  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Crush Care AI — Chat";
  }, []);

  // Greet the user on first visit and try speaking it
  useEffect(() => {
    const text = language === "hi-IN" ? "प्रिय, मैं आपकी कैसे मदद कर सकता/सकती हूँ? 💖" : "How can I help you, dear? 💖";
    setMessages((m) => {
      if (m.length > 0) return m;
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text,
        language,
        timestamp: Date.now(),
      };
      return [aiMsg];
    });
    (async () => {
      try {
        const base64 = await synthesizeSpeech(text, language);
        const audio = new Audio(`data:audio/mp3;base64,${base64}`);
        await audio.play();
      } catch {}
    })();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendUserMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        sender: "user",
        text: text.trim(),
        language,
        timestamp: Date.now(),
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const [aiText, recipe] = await Promise.all([
          generateGeminiReply(userMsg.text, language),
          fetchRandomRecipe(),
        ]);

        const aiMsg: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: aiText,
          language,
          recipeName: recipe?.strMeal,
          timestamp: Date.now(),
        };
        setMessages((m) => [...m, aiMsg]);
      } catch (e) {
        const errMsg: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text:
            language === "hi-IN"
              ? "क्षमा करें, अभी उत्तर देने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
              : "Sorry, I ran into an issue. Please try again later.",
          language,
          timestamp: Date.now(),
        };
        setMessages((m) => [...m, errMsg]);
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  const handleSpeak = useCallback(async (msg: Message) => {
    try {
      const base64 = await synthesizeSpeech(msg.text, msg.language);
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      await audio.play();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        try {
          const base64 = await blobToBase64(blob);
          const transcript = await transcribeWebmBase64(base64, language);
          if (transcript) {
            await sendUserMessage(transcript);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setRecording(false);
          chunksRef.current = [];
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
      setRecording(false);
    }
  }, [language, sendUserMessage]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Crush Care AI
          </Typography>
          <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel id="lang-label">Language</InputLabel>
            <Select
              labelId="lang-label"
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            >
              <MenuItem value="en-US">English</MenuItem>
              <MenuItem value="hi-IN">हिन्दी</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Toggle light/dark">
            <IconButton onClick={colorMode.toggle} color="primary">
              {colorMode.mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, display: "flex", flexDirection: "column", py: 2 }}>
        <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", pb: 10 }}>
          <Stack spacing={2}>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onSpeak={handleSpeak} />
            ))}
            {loading && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Crush Care AI is thinking…</Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </Container>

      <Paper elevation={3} sx={{ position: "fixed", left: 0, right: 0, bottom: 0, py: 1 }}>
        <Container maxWidth="md">
          <Stack direction="row" spacing={1} alignItems="center">
            <InputBase
              placeholder={language === "hi-IN" ? "अपना संदेश लिखें…" : "Type a message…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage(input);
                }
              }}
              sx={{ flex: 1, px: 2, py: 1, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 2 }}
            />
            <IconButton color="primary" onClick={() => sendUserMessage(input)} aria-label="Send">
              <SendRoundedIcon />
            </IconButton>
          </Stack>
        </Container>
      </Paper>

      <Tooltip title={recording ? "Stop" : "Speak"}>
        <Fab
          color={recording ? "secondary" : "primary"}
          onClick={() => (recording ? stopRecording() : startRecording())}
          sx={{ position: "fixed", right: 24, bottom: 88 }}
          aria-label="Record voice"
        >
          {recording ? <StopRoundedIcon /> : <MicRoundedIcon />}
        </Fab>
      </Tooltip>
    </Box>
  );
}
