"use client";

import { useState, useEffect } from "react";

export interface Task {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export function useTasks() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "geral", name: "Geral", color: "#3b82f6", createdAt: new Date() },
  ]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedCategories = localStorage.getItem("categories");

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map(
          (
            task: Omit<Task, "createdAt" | "completedAt"> & {
              createdAt: string;
              completedAt?: string;
            }
          ) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt
              ? new Date(task.completedAt)
              : undefined,
          })
        );
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    }

    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories).map(
          (cat: Omit<Category, "createdAt"> & { createdAt: string }) => ({
            ...cat,
            createdAt: new Date(cat.createdAt),
          })
        );
        setCategories(parsedCategories);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
  }, []);

  // Salvar tarefas no localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Salvar categorias no localStorage
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addTask = (text: string, category: string) => {
    if (!text.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: text.trim(),
      category,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addCategory = (name: string, color: string = "#3b82f6") => {
    if (!name.trim()) return;

    const newCategory: Category = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
      color,
      createdAt: new Date(),
    };

    setCategories((prev) => [newCategory, ...prev]);
    return newCategory.id;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );

    // Atualizar tarefas que usam esta categoria
    setTasks((prev) =>
      prev.map((task) =>
        task.category === categories.find((c) => c.id === id)?.name
          ? { ...task, category: updates.name || task.category }
          : task
      )
    );
  };

  const deleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setTasks((prev) => prev.filter((task) => task.category !== category.name));
  };

  const getTasksByCategory = (categoryName: string) => {
    return tasks.filter((task) => task.category === categoryName);
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.completed);
  };

  const getTaskStats = () => {
    const completed = getCompletedTasks().length;
    const total = tasks.length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending: total - completed,
      completionRate,
    };
  };

  return {
    tasks,
    categories,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    addCategory,
    updateCategory,
    deleteCategory,
    getTasksByCategory,
    getCompletedTasks,
    getTaskStats,
  };
}
