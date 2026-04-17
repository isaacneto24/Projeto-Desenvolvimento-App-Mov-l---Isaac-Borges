export const theme = {
  colors: {
    background: "#F4F1EA",
    card: "#FFFDF8",
    primary: "#176B4D",
    primaryDark: "#12543C",
    text: "#1F2933",
    textSecondary: "#52606D",
    border: "#D9D4C7",
    inputBackground: "#FFFFFF",
    error: "#B42318",
    success: "#027A48",
    muted: "#7B8794",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 28,
    },
    fontWeight: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
  },
};

export type Theme = typeof theme;
