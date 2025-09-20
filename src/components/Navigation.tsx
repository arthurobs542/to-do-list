"use client";

import { Button } from "@/components/ui/button";
import { CheckSquare, Timer, User, Settings } from "lucide-react";

type TabType = "tasks" | "timer" | "profile" | "settings";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
}: NavigationProps) {
  const tabs = [
    { id: "tasks" as TabType, label: "Tarefas", icon: CheckSquare },
    { id: "timer" as TabType, label: "Timer", icon: Timer },
    { id: "profile" as TabType, label: "Perfil", icon: User },
    { id: "settings" as TabType, label: "Config", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-w-0 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium truncate">
                  {tab.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
