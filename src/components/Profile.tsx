"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Calendar,
  Target,
  Award,
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Palette,
  Moon,
  Sun,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  totalTasks: number;
  completedTasks: number;
  pomodorosCompleted: number;
  streak: number;
  avatar?: string;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  theme: "blue" | "green" | "purple" | "red";
  language: "pt" | "en" | "es";
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Usuário",
    email: "usuario@exemplo.com",
    joinDate: "Janeiro 2024",
    totalTasks: 0,
    completedTasks: 0,
    pomodorosCompleted: 0,
    streak: 0,
  });

  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: false,
    theme: "blue",
    language: "pt",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const completionRate =
    profile.totalTasks > 0
      ? Math.round((profile.completedTasks / profile.totalTasks) * 100)
      : 0;

  const themeColors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Meu Perfil
        </h1>
      </div>

      {/* Avatar e Informações Básicas */}
      <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600"
              >
                <Camera size={16} />
              </Button>
            </div>

            {/* Informações */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {profile.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                <Mail size={16} className="inline mr-2" />
                {profile.email}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <Calendar size={16} className="inline mr-2" />
                Membro desde {profile.joinDate}
              </p>
            </div>

            {/* Botão Editar */}
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              Editar Perfil
            </Button>
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {profile.totalTasks}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total de Tarefas
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {profile.completedTasks}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Concluídas
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {profile.pomodorosCompleted}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Pomodoros
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {profile.streak}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sequência
              </div>
            </div>
          </div>

          {/* Taxa de Conclusão */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Taxa de Conclusão
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conquistas */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Conquistas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Award className="text-yellow-500" size={24} />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">
                  Primeira Tarefa
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Complete sua primeira tarefa
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Target className="text-green-500" size={24} />
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">
                  Foco Total
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Complete 10 pomodoros
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Configurações */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Configurações
          </h3>
          <div className="space-y-4">
            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Notificações
                </span>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: !prev.notifications,
                  }))
                }
              >
                {settings.notifications ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Modo Escuro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                  />
                ) : (
                  <Sun
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                  />
                )}
                <span className="text-slate-700 dark:text-slate-300">
                  Modo Escuro
                </span>
              </div>
              <Button
                variant={settings.darkMode ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
                }
              >
                {settings.darkMode ? "Ativo" : "Inativo"}
              </Button>
            </div>

            {/* Tema */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
                <span className="text-slate-700 dark:text-slate-300">Tema</span>
              </div>
              <div className="flex gap-2">
                {Object.entries(themeColors).map(([key, color]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={settings.theme === key ? "default" : "outline"}
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, theme: key as any }))
                    }
                    className={`w-8 h-8 p-0 ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de Edição */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Editar Perfil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nome
                </label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <Input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save size={16} className="mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
