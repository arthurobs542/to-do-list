"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface TimerSettings {
  work: number; // em minutos
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number; // intervalo para pausa longa
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  notificationPermission: NotificationPermission;
}

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  completedPomodoros: number;
  lastUpdate: number;
  settings: TimerSettings;
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [completedMode, setCompletedMode] = useState<TimerMode>("work");
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    notificationsEnabled: true,
    soundEnabled: true,
    notificationPermission: "default",
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Funções de notificação e som
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      setSettings((prev) => ({
        ...prev,
        notificationPermission: permission,
      }));
      return permission === "granted";
    }

    return false;
  }, []);

  const showNotification = useCallback(
    (title: string, body: string, icon?: string) => {
      if (
        !settings.notificationsEnabled ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const notification = new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
        tag: "pomodoro-timer",
        requireInteraction: true,
      });

      // Auto fechar após 10 segundos
      setTimeout(() => {
        notification.close();
      }, 10000);

      // Focar na janela quando clicar na notificação
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    },
    [settings.notificationsEnabled]
  );

  const playNotificationSound = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      // Criar um novo contexto de áudio para evitar conflitos
      const AudioContextClass =
        window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();

      // Criar um tom de notificação simples
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar o som - tom de notificação agradável
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Erro ao reproduzir som:", error);
    }
  }, [settings.soundEnabled]);

  // Funções de localStorage
  const saveTimerState = useCallback(
    (state: Partial<TimerState>) => {
      const currentState = {
        timeLeft,
        isRunning,
        mode,
        completedPomodoros,
        lastUpdate: Date.now(),
        settings,
        ...state,
      };
      localStorage.setItem(
        "pomodoro-timer-state",
        JSON.stringify(currentState)
      );
    },
    [timeLeft, isRunning, mode, completedPomodoros, settings]
  );

  const loadTimerState = useCallback((): TimerState | null => {
    try {
      const saved = localStorage.getItem("pomodoro-timer-state");
      if (!saved) return null;

      const state = JSON.parse(saved) as TimerState;
      const now = Date.now();
      const timePassed = Math.floor((now - state.lastUpdate) / 1000);

      // Se o timer estava rodando, calcular o tempo restante
      if (state.isRunning && timePassed > 0) {
        const newTimeLeft = Math.max(0, state.timeLeft - timePassed);
        if (newTimeLeft === 0) {
          // Timer terminou, determinar próximo modo
          const newMode =
            state.mode === "work"
              ? state.completedPomodoros + 1 >= state.settings.longBreakInterval
                ? "longBreak"
                : "shortBreak"
              : "work";

          const newCompletedPomodoros =
            state.mode === "work" && newMode === "longBreak"
              ? 0
              : state.mode === "work"
              ? state.completedPomodoros + 1
              : state.completedPomodoros;

          const newDuration =
            newMode === "work"
              ? state.settings.work * 60
              : newMode === "shortBreak"
              ? state.settings.shortBreak * 60
              : state.settings.longBreak * 60;

          return {
            ...state,
            timeLeft: newDuration,
            mode: newMode,
            completedPomodoros: newCompletedPomodoros,
            isRunning: false,
            lastUpdate: now,
          };
        }

        return {
          ...state,
          timeLeft: newTimeLeft,
          lastUpdate: now,
        };
      }

      return state;
    } catch (error) {
      console.error("Erro ao carregar estado do timer:", error);
      return null;
    }
  }, []);

  // Carregar estado inicial do localStorage e verificar permissões
  useEffect(() => {
    const savedState = loadTimerState();
    if (savedState) {
      setTimeLeft(savedState.timeLeft);
      setIsRunning(savedState.isRunning);
      setMode(savedState.mode);
      setCompletedPomodoros(savedState.completedPomodoros);
      setSettings((prev) => ({
        ...prev,
        ...savedState.settings,
        notificationPermission: Notification.permission,
      }));
    } else {
      // Se não há estado salvo, verificar permissão atual
      setSettings((prev) => ({
        ...prev,
        notificationPermission: Notification.permission,
      }));
    }

    // Solicitar permissão para notificações na primeira vez
    if (Notification.permission === "default") {
      requestNotificationPermission();
    }
  }, [loadTimerState, requestNotificationPermission]);

  // Configurações dos modos
  const modeConfig = useMemo(
    () => ({
      work: {
        duration: settings.work * 60,
        label: "Foco",
        icon: Clock,
        color: "bg-red-500",
      },
      shortBreak: {
        duration: settings.shortBreak * 60,
        label: "Pausa Curta",
        icon: Coffee,
        color: "bg-green-500",
      },
      longBreak: {
        duration: settings.longBreak * 60,
        label: "Pausa Longa",
        icon: Coffee,
        color: "bg-blue-500",
      },
    }),
    [settings.work, settings.shortBreak, settings.longBreak]
  );

  // Formatar tempo para exibição
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calcular progresso
  const progress =
    ((modeConfig[mode].duration - timeLeft) / modeConfig[mode].duration) * 100;

  // Iniciar timer
  const startTimer = () => {
    setIsRunning(true);
    saveTimerState({ isRunning: true });
  };

  // Pausar timer
  const pauseTimer = () => {
    setIsRunning(false);
    saveTimerState({ isRunning: false });
  };

  // Resetar timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeConfig[mode].duration);
    saveTimerState({
      isRunning: false,
      timeLeft: modeConfig[mode].duration,
    });
  };

  // Alternar entre modos
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeConfig[newMode].duration);
    saveTimerState({
      isRunning: false,
      mode: newMode,
      timeLeft: modeConfig[newMode].duration,
    });
  };

  // Efeito do timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          saveTimerState({ timeLeft: newTime });
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      // Determinar próximo modo e mensagens
      let nextMode: TimerMode;
      let newCompletedPomodoros: number;
      let notificationTitle: string;
      let notificationBody: string;

      if (mode === "work") {
        nextMode =
          completedPomodoros + 1 >= settings.longBreakInterval
            ? "longBreak"
            : "shortBreak";
        newCompletedPomodoros =
          nextMode === "longBreak" ? 0 : completedPomodoros + 1;

        notificationTitle = "🍅 Pomodoro Concluído!";
        notificationBody =
          nextMode === "longBreak"
            ? "Hora da pausa longa! Você completou 4 pomodoros."
            : "Hora da pausa curta! Bom trabalho!";

        setMode(nextMode);
        setTimeLeft(modeConfig[nextMode].duration);
        setCompletedPomodoros(newCompletedPomodoros);

        saveTimerState({
          isRunning: false,
          mode: nextMode,
          timeLeft: modeConfig[nextMode].duration,
          completedPomodoros: newCompletedPomodoros,
        });
      } else {
        nextMode = "work";
        notificationTitle = "☕ Pausa Finalizada!";
        notificationBody =
          "Hora de voltar ao foco! Vamos começar um novo pomodoro.";

        setMode("work");
        setTimeLeft(modeConfig.work.duration);
        saveTimerState({
          isRunning: false,
          mode: "work",
          timeLeft: modeConfig.work.duration,
        });
      }

      // Tocar som de notificação
      playNotificationSound();

      // Mostrar notificação
      showNotification(notificationTitle, notificationBody);

      // Mostrar alerta visual temporário
      setCompletedMode(mode);
      setShowCompletionAlert(true);
      setTimeout(() => setShowCompletionAlert(false), 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isRunning,
    timeLeft,
    mode,
    completedPomodoros,
    settings,
    modeConfig,
    playNotificationSound,
    showNotification,
    saveTimerState,
  ]);

  // Salvar configurações quando mudarem
  useEffect(() => {
    saveTimerState({ settings });
  }, [settings, saveTimerState]);

  // Listener para detectar quando a página é fechada/aberta
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Página foi reaberta, recarregar estado
        const savedState = loadTimerState();
        if (savedState) {
          setTimeLeft(savedState.timeLeft);
          setIsRunning(savedState.isRunning);
          setMode(savedState.mode);
          setCompletedPomodoros(savedState.completedPomodoros);
          setSettings(savedState.settings);
        }
      }
    };

    const handleBeforeUnload = () => {
      // Salvar estado final antes de fechar
      saveTimerState({
        timeLeft,
        isRunning,
        mode,
        completedPomodoros,
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    timeLeft,
    isRunning,
    mode,
    completedPomodoros,
    settings,
    loadTimerState,
    saveTimerState,
  ]);

  // Limpar interval ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  return (
    <div className="max-w-lg mx-auto space-y-4 px-4 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Pomodoro Timer
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <CheckCircle size={14} />
          <p className="text-sm font-medium">
            {completedPomodoros} pomodoros concluídos hoje
          </p>
        </div>
      </div>

      {/* Seleção de Modos - Compacta */}
      <div className="flex justify-center gap-2">
        {Object.entries(modeConfig).map(([key, config]) => {
          const modeKey = key as TimerMode;
          const Icon = config.icon;
          const isActive = mode === modeKey;

          return (
            <Button
              key={key}
              variant={isActive ? "default" : "outline"}
              onClick={() => switchMode(modeKey)}
              size="sm"
              className={`px-3 py-2 h-auto flex items-center gap-2 ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{config.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Alerta de Conclusão */}
      {showCompletionAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <Card className="bg-green-500 text-white shadow-lg border-0 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">
                {completedMode === "work"
                  ? "🍅 Pomodoro Concluído!"
                  : "☕ Pausa Finalizada!"}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Timer Principal */}
      <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl overflow-hidden relative">
        <div className="p-6 text-center">
          {/* Modo Atual */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className={`w-2 h-2 rounded-full ${currentConfig.color}`}
            ></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {currentConfig.label}
            </span>
            <Icon size={16} className="text-slate-600 dark:text-slate-400" />
          </div>

          {/* Timer Display */}
          <div className="mb-6">
            <div className="text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-3">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                <Play size={18} className="mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                size="lg"
                variant="outline"
                className="px-6 py-2"
              >
                <Pause size={18} className="mr-2" />
                Pausar
              </Button>
            )}
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="px-4 py-2"
            >
              <RotateCcw size={18} />
            </Button>
          </div>
        </div>

        {/* Botão de Configurações - Fixo no canto inferior direito */}
        <Button
          onClick={() => setShowSettings(!showSettings)}
          size="sm"
          variant="ghost"
          className="absolute bottom-2 right-2 w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Settings size={16} className="text-slate-600 dark:text-slate-400" />
        </Button>
      </Card>

      {/* Configurações - Modal/Dropdown */}
      {showSettings && (
        <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Configurações
              </h3>
              <Button
                onClick={() => setShowSettings(false)}
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              {/* Configurações de Tempo */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Foco (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.work}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        work: parseInt(e.target.value) || 25,
                      }))
                    }
                    className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pausa Curta (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreak}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shortBreak: parseInt(e.target.value) || 5,
                      }))
                    }
                    className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pausa Longa (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreak}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        longBreak: parseInt(e.target.value) || 15,
                      }))
                    }
                    className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Configurações de Notificação */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notificações
                </h4>

                {/* Som */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Som de notificação
                  </label>
                  <Button
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        soundEnabled: !prev.soundEnabled,
                      }))
                    }
                    size="sm"
                    variant={settings.soundEnabled ? "default" : "outline"}
                    className="w-16 h-6 text-xs"
                  >
                    {settings.soundEnabled ? "ON" : "OFF"}
                  </Button>
                </div>

                {/* Notificações */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Notificações push
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          notificationsEnabled: !prev.notificationsEnabled,
                        }))
                      }
                      size="sm"
                      variant={
                        settings.notificationsEnabled ? "default" : "outline"
                      }
                      className="w-16 h-6 text-xs"
                    >
                      {settings.notificationsEnabled ? "ON" : "OFF"}
                    </Button>
                    {settings.notificationPermission === "default" && (
                      <Button
                        onClick={requestNotificationPermission}
                        size="sm"
                        variant="outline"
                        className="w-16 h-6 text-xs"
                      >
                        Permitir
                      </Button>
                    )}
                  </div>
                </div>

                {/* Status da permissão */}
                {settings.notificationPermission !== "granted" && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {settings.notificationPermission === "denied"
                      ? "Permissão negada. Ative nas configurações do navegador."
                      : "Permissão pendente. Clique em 'Permitir' para ativar."}
                  </div>
                )}

                {/* Botão de teste */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={() => {
                      playNotificationSound();
                      showNotification(
                        "🔔 Teste",
                        "Esta é uma notificação de teste!"
                      );
                    }}
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1"
                  >
                    Testar Som & Notificação
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
