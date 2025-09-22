"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/app/contexts/UserContext";
import {
  Bell,
  Palette,
  Volume2,
  VolumeX,
  Languages,
  Download,
  Upload,
  RefreshCw,
  Save,
} from "lucide-react";

export default function Settings() {
  const { settings, updateSettings, isLoading, error } = useUser();
  const [volume, setVolume] = useState(settings.volume);

  const themeColors = {
    blue: { bg: "bg-blue-500", name: "Azul" },
    green: { bg: "bg-green-500", name: "Verde" },
    purple: { bg: "bg-purple-500", name: "Roxo" },
    red: { bg: "bg-red-500", name: "Vermelho" },
  };

  const languages = {
    pt: "Português",
    en: "English",
    es: "Español",
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    updateSettings({ volume: newVolume });
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "focus-app-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.settings) {
            updateSettings(data.settings);
          }
        } catch (error) {
          console.error("Erro ao importar dados:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm("Tem certeza que deseja resetar todas as configurações?")) {
      updateSettings({
        notifications: true,
        soundEnabled: true,
        pomodoroNotifications: true,
        taskReminders: true,
        autoSave: true,
        theme: "blue",
        language: "pt",
        volume: 50,
      });
      setVolume(50);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 px-4 pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Configurações
        </h1>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Aparência */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Palette size={20} />
            Aparência
          </h3>
          <div className="space-y-4">
            {/* Tema */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Tema de Cores
                </span>
              </div>
              <div className="flex gap-2">
                {Object.entries(themeColors).map(([key, theme]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={settings.theme === key ? "default" : "outline"}
                    onClick={() =>
                      updateSettings({ theme: key as typeof settings.theme })
                    }
                    className={`w-8 h-8 p-0 ${theme.bg} hover:opacity-80`}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Notificações */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notificações
          </h3>
          <div className="space-y-4">
            {/* Notificações Gerais */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Notificações Gerais
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Receber notificações do sistema
                </div>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateSettings({ notifications: !settings.notifications })
                }
                disabled={isLoading}
              >
                {settings.notifications ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Notificações Pomodoro */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Notificações Pomodoro
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Alertas de início e fim de sessões
                </div>
              </div>
              <Button
                variant={settings.pomodoroNotifications ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateSettings({
                    pomodoroNotifications: !settings.pomodoroNotifications,
                  })
                }
                disabled={isLoading}
              >
                {settings.pomodoroNotifications ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Lembretes de Tarefas */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Lembretes de Tarefas
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Notificações para tarefas pendentes
                </div>
              </div>
              <Button
                variant={settings.taskReminders ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateSettings({ taskReminders: !settings.taskReminders })
                }
                disabled={isLoading}
              >
                {settings.taskReminders ? "Ativo" : "Inativo"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Áudio */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            {settings.soundEnabled ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
            Áudio
          </h3>
          <div className="space-y-4">
            {/* Som Habilitado */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Som Habilitado
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Reproduzir sons de notificação
                </div>
              </div>
              <Button
                variant={settings.soundEnabled ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateSettings({ soundEnabled: !settings.soundEnabled })
                }
                disabled={isLoading}
              >
                {settings.soundEnabled ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Volume */}
            {settings.soundEnabled && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Volume
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Idioma */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Languages size={20} />
            Idioma
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                Idioma da Interface
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Escolha o idioma preferido
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) =>
                updateSettings({
                  language: e.target.value as "en" | "pt" | "es",
                })
              }
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              disabled={isLoading}
            >
              {Object.entries(languages).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Dados */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Dados
          </h3>
          <div className="space-y-4">
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Salvamento Automático
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Salvar alterações automaticamente
                </div>
              </div>
              <Button
                variant={settings.autoSave ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                disabled={isLoading}
              >
                {settings.autoSave ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Exportar/Importar */}
            <div className="flex gap-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Download size={16} />
                Exportar
              </Button>
              <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600">
                <Upload size={16} />
                Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>

            {/* Resetar */}
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="flex items-center gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              Resetar Configurações
            </Button>
          </div>
        </div>
      </Card>

      {/* Status de Sincronização */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Save size={20} className="text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Sincronização Automática
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Suas configurações são salvas automaticamente e sincronizadas
                com o backend
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
