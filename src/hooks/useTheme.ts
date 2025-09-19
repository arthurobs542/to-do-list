"use client";

import { useState, useEffect } from "react";

type Theme = "light" | "dark";
type ColorTheme = "blue" | "green" | "purple" | "red";

interface ThemeSettings {
  theme: Theme;
  colorTheme: ColorTheme;
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
}

export function useTheme() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    theme: "light",
    colorTheme: "blue",
    notifications: true,
    soundEnabled: true,
    autoSave: true,
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("theme-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setThemeSettings(parsed);
      } catch (error) {
        console.error("Erro ao carregar configurações de tema:", error);
      }
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem("theme-settings", JSON.stringify(themeSettings));
  }, [themeSettings]);

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement;
    if (themeSettings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeSettings.theme]);

  const toggleTheme = () => {
    setThemeSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const setColorTheme = (colorTheme: ColorTheme) => {
    setThemeSettings((prev) => ({
      ...prev,
      colorTheme,
    }));
  };

  const updateSettings = (updates: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return {
    themeSettings,
    toggleTheme,
    setColorTheme,
    updateSettings,
  };
}
