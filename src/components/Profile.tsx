"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/app/contexts/UserContext";
import {
  Mail,
  Calendar,
  Target,
  Award,
  Trophy,
  Flame,
  Edit3,
  Save,
  X,
  Camera,
  TrendingUp,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

const achievementIcons = {
  Award,
  Target,
  Trophy,
  Flame,
};

export default function Profile() {
  const { profile, settings, updateProfile, updateSettings, isLoading, error } =
    useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile.name,
    email: profile.email,
  });

  const handleSave = async () => {
    await updateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: profile.name, email: profile.email });
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

  const unlockedAchievements = profile.achievements.filter((a) => a.unlocked);
  const lockedAchievements = profile.achievements.filter((a) => !a.unlocked);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 px-4 pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Carregando perfil...
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
          Meu Perfil
        </h1>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Avatar e Informações Básicas */}
      <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-24 h-24 bg-gradient-to-br ${
                  themeColors[settings.theme]
                } rounded-full flex items-center justify-center text-white text-2xl font-bold`}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                <Camera size={16} />
              </Button>
            </div>

            {/* Informações */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {profile.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={16} />
                {profile.email}
              </p>
              <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                <Calendar size={16} />
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
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Estatísticas
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Taxa de Conclusão
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className={`bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conquistas */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Award size={20} />
            Conquistas ({unlockedAchievements.length}/
            {profile.achievements.length})
          </h3>

          <div className="space-y-4">
            {/* Conquistas Desbloqueadas */}
            {unlockedAchievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Desbloqueadas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unlockedAchievements.map((achievement) => {
                    const IconComponent =
                      achievementIcons[
                        achievement.icon as keyof typeof achievementIcons
                      ] || Award;
                    return (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                      >
                        <IconComponent
                          className="text-green-600 dark:text-green-400"
                          size={24}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-800 dark:text-slate-100">
                            {achievement.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {achievement.description}
                          </div>
                          {achievement.unlockedAt && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Desbloqueada em{" "}
                              {new Date(
                                achievement.unlockedAt
                              ).toLocaleDateString("pt-BR")}
                            </div>
                          )}
                        </div>
                        <CheckCircle
                          className="text-green-600 dark:text-green-400"
                          size={20}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conquistas Bloqueadas */}
            {lockedAchievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Em Progresso
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lockedAchievements.map((achievement) => {
                    const IconComponent =
                      achievementIcons[
                        achievement.icon as keyof typeof achievementIcons
                      ] || Award;
                    return (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg opacity-60"
                      >
                        <IconComponent className="text-slate-400" size={24} />
                        <div className="flex-1">
                          <div className="font-medium text-slate-600 dark:text-slate-400">
                            {achievement.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-500">
                            {achievement.description}
                          </div>
                        </div>
                        <Clock className="text-slate-400" size={20} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Configurações Rápidas */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Zap size={20} />
            Configurações Rápidas
          </h3>

          <div className="space-y-4">
            {/* Tema */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Tema de Cores
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Personalize a aparência do app
                </div>
              </div>
              <div className="flex gap-2">
                {Object.entries(themeColors).map(([key, color]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={settings.theme === key ? "default" : "outline"}
                    onClick={() =>
                      updateSettings({ theme: key as typeof settings.theme })
                    }
                    className={`w-8 h-8 p-0 ${color} hover:opacity-80`}
                    title={`Tema ${key}`}
                  />
                ))}
              </div>
            </div>

            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  Notificações
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Receber alertas do sistema
                </div>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateSettings({ notifications: !settings.notifications })
                }
              >
                {settings.notifications ? "Ativo" : "Inativo"}
              </Button>
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
                  placeholder="Seu nome"
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
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Save size={16} className="mr-2" />
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
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
