import { Card, CardContent, Typography, Stack, IconButton, Chip } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { ChatMessage as Message } from "@/types/chat";

interface Props {
  message: Message;
  onSpeak?: (message: Message) => void;
}

export default function ChatMessage({ message, onSpeak }: Props) {
  const isAI = message.sender === "ai";

  return (
    <Stack direction="row" justifyContent={isAI ? "flex-start" : "flex-end"} sx={{ width: "100%" }}>
      <Card
        sx={{
          maxWidth: 560,
          bgcolor: isAI ? "background.paper" : "primary.main",
          color: isAI ? "text.primary" : "primary.contrastText",
          p: 1,
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            {isAI ? (
              <SmartToyRoundedIcon color={isAI ? "secondary" : undefined} />
            ) : (
              <PersonRoundedIcon />
            )}
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
            {isAI && (
              <IconButton size="small" aria-label="Speak" onClick={() => onSpeak?.(message)}>
                <VolumeUpRoundedIcon />
              </IconButton>
            )}
          </Stack>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {message.text}
          </Typography>


          {message.recipeName && (
            <Chip
              label={`Quick recipe: ${message.recipeName}`}
              color={isAI ? "secondary" : "default"}
              variant={isAI ? "outlined" : "filled"}
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
