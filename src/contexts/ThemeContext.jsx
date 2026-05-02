import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('mf-theme') || 'dark');
  const [accent, setAccent] = useState(localStorage.getItem('mf-accent') || '#00e5ff');
  const [contrast, setContrast] = useState(parseFloat(localStorage.getItem('mf-contrast')) || 1);

  useEffect(() => {
    localStorage.setItem('mf-theme', theme);
    localStorage.setItem('mf-accent', accent);
    localStorage.setItem('mf-contrast', contrast);
  }, [theme, accent, contrast]);

  const tokens = {
    dark: {
      bg: "#050508",
      surface: "#0a0a10",
      card: "#0f0f18",
      cardHover: "#13131e",
      border: "#1c1c2e",
      borderMid: "#2c2c3e",
      text: "#f0f0fa",
      textSoft: "#9090b8",
      textMuted: "#55557a",
      cyan: accent,
      cyanDim: `${accent}12`,
      purple: "#9b6dff",
      purpleDim: "#9b6dff12",
      amber: "#f59e0b",
      green: "#10b981",
      red: "#ef4444",
      fontDisplay: "'Space Grotesk', system-ui, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
    },
    light: {
      bg: "#f8fafc",
      surface: "#ffffff",
      card: "#ffffff",
      cardHover: "#f1f5f9",
      border: "#e2e8f0",
      borderMid: "#cbd5e1",
      text: "#0f172a",
      textSoft: "#475569",
      textMuted: "#94a3b8",
      cyan: accent,
      cyanDim: `${accent}12`,
      purple: "#8b5cf6",
      purpleDim: "#8b5cf612",
      amber: "#d97706",
      green: "#059669",
      red: "#dc2626",
      fontDisplay: "'Space Grotesk', system-ui, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
    }
  };

  const T = tokens[theme];

  // Apply contrast filter to body
  useEffect(() => {
    document.body.style.filter = `contrast(${contrast})`;
  }, [contrast]);

  const value = {
    theme,
    setTheme,
    accent,
    setAccent,
    contrast,
    setContrast,
    T,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
