import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ColorModeContext, getAppTheme } from "@/theme";

const queryClient = new QueryClient();

const App = () => {
  const [mode, setMode] = useState<"light" | "dark">(() => (localStorage.getItem("ccai_mode") as "light" | "dark") || "light");

  useEffect(() => {
    localStorage.setItem("ccai_mode", mode);
  }, [mode]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={{ mode, toggle: () => setMode((m) => (m === "light" ? "dark" : "light")) }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<Chat />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
