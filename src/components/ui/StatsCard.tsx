"use client";

import { ReactNode } from "react";
import { Card } from "./card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
}: StatsCardProps) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-xl p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <div className="text-slate-600 dark:text-slate-400">{icon}</div>
            )}
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </span>
          </div>
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </div>
          )}
        </div>
        {trend && (
          <div
            className={`text-sm font-medium ${
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>
    </Card>
  );
}
