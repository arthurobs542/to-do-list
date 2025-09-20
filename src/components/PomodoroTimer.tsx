"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

type TimerMode = "work" | "shortBreak" | "longBreak";

interface TimerSettings {
  work: number; // em minutos
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number; // intervalo para pausa longa
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Configurações dos modos
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const modeConfig = {
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
  };

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
  };

  // Pausar timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Resetar timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeConfig[mode].duration);
  };

  // Alternar entre modos
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeConfig[newMode].duration);
  };

  // Efeito do timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Tocar som de notificação (se disponível)
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignorar erro se áudio não puder ser reproduzido
        });
      }

      // Determinar próximo modo
      if (mode === "work") {
        const nextMode =
          completedPomodoros + 1 >= settings.longBreakInterval
            ? "longBreak"
            : "shortBreak";
        setMode(nextMode);
        setTimeLeft(modeConfig[nextMode].duration);
        if (nextMode === "longBreak") {
          setCompletedPomodoros(0);
        } else {
          setCompletedPomodoros((prev) => prev + 1);
        }
      } else {
        setMode("work");
        setTimeLeft(modeConfig.work.duration);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, completedPomodoros, settings, modeConfig]);

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
    <div className="max-w-2xl mx-auto space-y-6 px-4 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Pomodoro Timer
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <CheckCircle size={16} />
          <p className="text-sm sm:text-base font-medium">
            {completedPomodoros} pomodoros concluídos hoje
          </p>
        </div>
      </div>

      {/* Timer Principal */}
      <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="p-8 text-center">
          {/* Modo Atual */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${currentConfig.color}`}
            ></div>
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {currentConfig.label}
            </span>
            <Icon size={20} className="text-slate-600 dark:text-slate-400" />
          </div>

          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-6xl sm:text-7xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-4">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="w-full h-3" />
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Play size={20} className="mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg"
              >
                <Pause size={20} className="mr-2" />
                Pausar
              </Button>
            )}
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="px-6 py-3 text-lg"
            >
              <RotateCcw size={20} className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Seleção de Modos */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Modos de Timer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(modeConfig).map(([key, config]) => {
              const modeKey = key as TimerMode;
              const Icon = config.icon;
              const isActive = mode === modeKey;

              return (
                <Button
                  key={key}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => switchMode(modeKey)}
                  className={`p-4 h-auto flex flex-col items-center gap-2 ${
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-medium">{config.label}</span>
                  <span className="text-sm opacity-75">
                    {Math.floor(config.duration / 60)}min
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Configurações */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Configurações
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Áudio para notificações */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
