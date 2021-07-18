import { createTheme } from "@material-ui/core/styles";

export const lightTheme = createTheme({
  typography: {
    fontFamily: "'Barlow', sans-serif",
    fontWeightRegular: 500,
    button: {
      textTransform: "initial",
      fontSize: "1rem",
    },
  },
  palette: {
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    background: {
      default: "#f9fafb",
    },
  },
});
