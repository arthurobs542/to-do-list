"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash } from "lucide-react";

type Task = {
  id: number;
  text: string;
  category: string;
  completed: boolean;
};

export default function TasksList() {
  const [categories, setCategories] = useState<string[]>(["Geral"]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<string>("Geral");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState<string>("Geral");
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newTask,
        category: newCategory,
        completed: false,
      },
    ]);
    setNewTask("");
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditCategory(task.category);
  };

  const saveEdit = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, text: editText, category: editCategory }
          : task
      )
    );
    setEditingId(null);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onDragStart = (id: number) => setDraggedId(id);
  const onDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;
    setTasks((prev) => {
      const draggedIdx = prev.findIndex((t) => t.id === draggedId);
      const targetIdx = prev.findIndex((t) => t.id === id);
      const updated = [...prev];
      const [removed] = updated.splice(draggedIdx, 1);
      updated.splice(targetIdx, 0, removed);
      return updated;
    });
  };
  const onDragEnd = () => setDraggedId(null);

  // Category handlers
  const addCategory = () => {
    const name = newCategoryName.trim();
    if (name && !categories.includes(name)) {
      setCategories((prev) => [name, ...prev]);
      setNewCategory(name);
    }
    setNewCategoryName("");
    setShowCategoryModal(false);
  };

  const startEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryName(cat);
  };

  const saveEditCategory = () => {
    if (!editingCategory) return;
    const newName = editCategoryName.trim();
    if (!newName || categories.includes(newName)) return;
    setCategories((prev) =>
      prev.map((cat) => (cat === editingCategory ? newName : cat))
    );
    setTasks((prev) =>
      prev.map((task) =>
        task.category === editingCategory
          ? { ...task, category: newName }
          : task
      )
    );
    setEditingCategory(null);
    setEditCategoryName("");
  };

  const deleteCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    setTasks((prev) => prev.filter((task) => task.category !== cat));
    if (newCategory === cat) setNewCategory(categories[0] || "");
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0 pb-20">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
          Minhas Tarefas
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-sm sm:text-base lg:text-lg font-medium">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
        </div>
      </div>
      {/* Tasks Container */}
      <div className="space-y-6">
        <Card className="w-full bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm">
          {categories.map((category) => (
            <div
              key={category}
              className="border-b border-slate-100 dark:border-slate-700 last:border-b-0"
            >
              {/* Category Header */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50">
                {editingCategory === category ? (
                  <div className="flex items-center gap-3">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800"
                      placeholder="Nome da categoria"
                    />
                    <Button
                      size="sm"
                      onClick={saveEditCategory}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
                        {category}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        (
                        {
                          tasks.filter((task) => task.category === category)
                            .length
                        }
                        )
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditCategory(category)}
                        className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-600"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category)}
                        className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {/* Tasks List */}
              <div className="px-6 py-4 space-y-3 min-h-[60px]">
                {tasks
                  .filter((task) => task.category === category)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="group p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-move"
                      draggable
                      onDragStart={() => onDragStart(task.id)}
                      onDragOver={(e) => onDragOver(e, task.id)}
                      onDragEnd={onDragEnd}
                    >
                      {editingId === task.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                            placeholder="Editar tarefa..."
                          />
                          <Select
                            value={editCategory}
                            onValueChange={(val) =>
                              setEditCategory(val as string)
                            }
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                              <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-3 justify-end">
                            <Button
                              size="sm"
                              onClick={() => saveEdit(task.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            id={`task-${task.id}`}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`text-base leading-relaxed flex-1 cursor-pointer ${
                              task.completed
                                ? "line-through text-slate-500 dark:text-slate-400"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {task.text}
                          </label>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(task)}
                              className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
                              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Add Task Form */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg border-0 rounded-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Adicionar Nova Tarefa
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={newCategory}
                onValueChange={(val) => setNewCategory(val as string)}
              >
                <SelectTrigger className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(true)}
                className="px-3 sm:px-4 border-slate-300 dark:border-slate-600 text-sm sm:text-base"
              >
                Nova Categoria
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escreva uma nova tarefa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <Button
                onClick={addTask}
                className="px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                disabled={!newTask.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Criar Nova Categoria
            </h2>
            <Input
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 mb-6"
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                onClick={addCategory}
                className="bg-green-600 hover:bg-green-700 order-2 sm:order-1"
                disabled={!newCategoryName.trim()}
              >
                Criar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewCategoryName("");
                  setShowCategoryModal(false);
                }}
                className="order-1 sm:order-2"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
