import React from "react";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export const ColorModeContext = React.createContext({
  mode: "light" as PaletteMode,
  toggle: () => {},
});

export const getAppTheme = (mode: PaletteMode) => {
  const common: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: "#ec4899", // Pink
        light: "#f472b6",
        dark: "#db2777",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#a78bfa", // Purple
        light: "#c4b5fd",
        dark: "#7c3aed",
        contrastText: "#1f2937",
      },
      info: {
        main: "#93c5fd", // Pastel Blue
        light: "#bfdbfe",
        dark: "#60a5fa",
        contrastText: "#0f172a",
      },
      background: {
        default: mode === "dark" ? "#0b1020" : "#f9fafb",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: mode === "dark" ? "linear-gradient(180deg, #0b1020 0%, #111827 100%)" : "linear-gradient(180deg, #fdf2f8 0%, #eef2ff 100%)",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backdropFilter: "saturate(180%) blur(10px)",
            backgroundColor: mode === "dark" ? "rgba(17, 24, 39, 0.6)" : "rgba(255, 255, 255, 0.7)",
            borderBottom: mode === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: mode === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
          },
        },
      },
    },
  } as ThemeOptions;

  return createTheme(common);
};
