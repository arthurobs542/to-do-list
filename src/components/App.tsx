"use client";

import { useState } from "react";
import Navigation from "./Navigation";
import TasksList from "./TasksList";
import PomodoroTimer from "./PomodoroTimer";
import Profile from "./Profile";
import Settings from "./Settings";

type TabType = "tasks" | "timer" | "profile" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("tasks");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "tasks":
        return <TasksList />;
      case "timer":
        return <PomodoroTimer />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <TasksList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {renderActiveComponent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
