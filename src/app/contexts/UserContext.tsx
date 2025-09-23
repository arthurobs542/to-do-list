"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useTheme } from "next-themes";

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  totalTasks: number;
  completedTasks: number;
  pomodorosCompleted: number;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AppSettings {
  notifications: boolean;
  soundEnabled: boolean;
  pomodoroNotifications: boolean;
  taskReminders: boolean;
  autoSave: boolean;
  theme: "blue" | "green" | "purple" | "red";
  language: "pt" | "en" | "es";
  volume: number;
}

interface UserContextType {
  profile: UserProfile;
  settings: AppSettings;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  addTask: (completed: boolean) => Promise<void>;
  addPomodoro: () => Promise<void>;
  updateStreak: () => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const defaultProfile: UserProfile = {
  name: "Usuário",
  email: "usuario@exemplo.com",
  joinDate: new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  }),
  totalTasks: 0,
  completedTasks: 0,
  pomodorosCompleted: 0,
  streak: 0,
  achievements: [
    {
      id: "first-task",
      name: "Primeira Tarefa",
      description: "Complete sua primeira tarefa",
      icon: "Award",
      unlocked: false,
    },
    {
      id: "focus-master",
      name: "Foco Total",
      description: "Complete 10 pomodoros",
      icon: "Target",
      unlocked: false,
    },
    {
      id: "task-master",
      name: "Mestre das Tarefas",
      description: "Complete 50 tarefas",
      icon: "Trophy",
      unlocked: false,
    },
    {
      id: "streak-keeper",
      name: "Sequência Perfeita",
      description: "Mantenha uma sequência de 7 dias",
      icon: "Flame",
      unlocked: false,
    },
  ],
};

const defaultSettings: AppSettings = {
  notifications: true,
  soundEnabled: true,
  pomodoroNotifications: true,
  taskReminders: true,
  autoSave: true,
  theme: "blue",
  language: "pt",
  volume: 50,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// API Base URL - substitua pela URL do seu backend Railway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTheme } = useTheme();

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("focus-app-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("focus-app-settings", JSON.stringify(settings));
  }, [settings]);

  const createUserOnBackend = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            profile,
            settings,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create user on backend");
        }
      } catch (error) {
        console.error("Error creating user on backend:", error);
      }
    },
    [profile, settings]
  );

  const syncWithBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user ID from localStorage or create one
      let userId = localStorage.getItem("focus-app-user-id");
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("focus-app-user-id", userId);
      }

      // Try to fetch user data from backend
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);

      if (response.ok) {
        const userData = await response.json();

        // Only update if data is different to prevent unnecessary re-renders
        setProfile((prev) => {
          const newProfile = { ...prev, ...userData.profile };
          return JSON.stringify(prev) !== JSON.stringify(newProfile)
            ? newProfile
            : prev;
        });

        setSettings((prev) => {
          const newSettings = { ...prev, ...userData.settings };
          return JSON.stringify(prev) !== JSON.stringify(newSettings)
            ? newSettings
            : prev;
        });
      } else if (response.status === 404) {
        // User doesn't exist on backend, create them
        await createUserOnBackend(userId);
      }
    } catch (error) {
      console.error("Error syncing with backend:", error);
      // Don't set error for network issues, just continue with localStorage
    } finally {
      setIsLoading(false);
    }
  }, [createUserOnBackend]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile
        const savedProfile = localStorage.getItem("focus-app-profile");
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile({ ...defaultProfile, ...parsedProfile });
        }

        // Load settings
        const savedSettings = localStorage.getItem("focus-app-settings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          const mergedSettings = { ...defaultSettings, ...parsedSettings };
          setSettings(mergedSettings);

          // Apply theme to next-themes
          if (mergedSettings.theme) {
            setTheme(mergedSettings.theme);
          }
        }

        // Try to sync with backend
        await syncWithBackend();
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Erro ao carregar dados do usuário");
      }
    };

    loadData();
  }, [setTheme, syncWithBackend]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);

      // Try to sync with backend
      const userId = localStorage.getItem("focus-app-user-id");
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profile: newProfile }),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile on backend");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Erro ao atualizar perfil");
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      setError(null);
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);

      // Apply theme changes to next-themes only if theme actually changed
      if (updates.theme && updates.theme !== settings.theme) {
        setTheme(updates.theme);
      }

      // Try to sync with backend
      const userId = localStorage.getItem("focus-app-user-id");
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ settings: newSettings }),
        });

        if (!response.ok) {
          throw new Error("Failed to update settings on backend");
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Erro ao atualizar configurações");
    }
  };

  const addTask = async (completed: boolean) => {
    const updates: Partial<UserProfile> = {
      totalTasks: profile.totalTasks + 1,
    };

    if (completed) {
      updates.completedTasks = profile.completedTasks + 1;

      // Check for achievements
      if (profile.totalTasks === 0) {
        await unlockAchievement("first-task");
      }
      if (profile.completedTasks === 49) {
        await unlockAchievement("task-master");
      }
    }

    await updateProfile(updates);
  };

  const addPomodoro = async () => {
    const updates: Partial<UserProfile> = {
      pomodorosCompleted: profile.pomodorosCompleted + 1,
    };

    // Check for achievements
    if (profile.pomodorosCompleted === 9) {
      await unlockAchievement("focus-master");
    }

    await updateProfile(updates);
  };

  const updateStreak = async () => {
    // This would be called daily to update the streak
    const updates: Partial<UserProfile> = {
      streak: profile.streak + 1,
    };

    // Check for achievements
    if (profile.streak === 6) {
      await unlockAchievement("streak-keeper");
    }

    await updateProfile(updates);
  };

  const unlockAchievement = async (achievementId: string) => {
    const achievement = profile.achievements.find(
      (a) => a.id === achievementId
    );
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = profile.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      );

      await updateProfile({ achievements: updatedAchievements });
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        settings,
        updateProfile,
        updateSettings,
        addTask,
        addPomodoro,
        updateStreak,
        unlockAchievement,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
