import { useMemo, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

const gradientBg = {
  background: {
    xs: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 50%, #eef2ff 100%)",
    sm: "radial-gradient(1200px 600px at 10% -10%, #ffe4e6 0%, transparent 40%), radial-gradient(1200px 600px at 110% 10%, #e0e7ff 0%, transparent 40%), linear-gradient(135deg, #fdf2f8 0%, #eff6ff 50%, #eef2ff 100%)",
  },
};

export default function Index() {
  useEffect(() => {
    document.title = "Crush Care AI – Anxiety Relief via Chat, Memes & Recipes";
  }, []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Crush Care AI",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0" },
      description:
        "AI-powered anxiety relief with kind conversations, memes, activities, and quick recipes in Hindi and English.",
    }),
    []
  );

  return (
    <Box sx={{ minHeight: "100vh", ...gradientBg }}>
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={4} textAlign="center" alignItems="center">
          <Typography component="h1" variant="h2" gutterBottom>
            Crush Care AI
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Helping your crush feel better ❤️ — Bilingual (Hindi/English) support with chat, memes, activities, and quick recipes.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/chat"
            >
              Start Chat
            </Button>
            <Button variant="outlined" color="secondary" size="large" href="#about">
              Learn More
            </Button>
          </Stack>
        </Stack>

        <Box id="about" sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            What makes it special?
          </Typography>
          <Typography color="text.secondary">
            Real-time conversation powered by Google Gemini, friendly guidance with fun memes and activities, plus quick recipes to lift your mood. Fully responsive and ready to deploy.
          </Typography>
        </Box>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Box>
  );
}
