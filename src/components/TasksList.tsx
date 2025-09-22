"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/contexts/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash,
  AlertTriangle,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

type Task = {
  id: number;
  text: string;
  category: string;
  completed: boolean;
};

export default function TasksList() {
  const { addTask: updateUserStats } = useUser();
  const categories = ["Alta", "Média", "Baixa"];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<string>("Média");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState<string>("Média");
  const [draggedId, setDraggedId] = useState<number | null>(null);

  // Accordion states
  const [expandedPriorities, setExpandedPriorities] = useState<{
    [key: string]: boolean;
  }>({
    Alta: true,
    Média: true,
    Baixa: true,
  });
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const wasCompleted = task.completed;
    const isNowCompleted = !wasCompleted;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // Update user stats
    if (!wasCompleted && isNowCompleted) {
      // Task was just completed
      await updateUserStats(true);
    } else if (wasCompleted && !isNowCompleted) {
      // Task was uncompleted - this is a new task being added
      await updateUserStats(false);
    }
  };

  const addTask = async () => {
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

    // Update user stats for adding a new task
    await updateUserStats(false);

    setNewTask("");
    setShowAddTaskModal(false);
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

  const onDropOnPriority = (e: React.DragEvent, targetPriority: string) => {
    e.preventDefault();
    if (draggedId === null) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedId ? { ...task, category: targetPriority } : task
      )
    );
    setDraggedId(null);
  };

  const onDragEnd = () => setDraggedId(null);

  // Accordion functions
  const togglePriority = (priority: string) => {
    setExpandedPriorities((prev) => ({
      ...prev,
      [priority]: !prev[priority],
    }));
  };

  // Priority helper functions
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case "Média":
        return <Circle className="w-3 h-3 text-yellow-500" />;
      case "Baixa":
        return <AlertTriangle className="w-3 h-3 text-blue-500 rotate-180" />;
      default:
        return <Circle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "Média":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "Baixa":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 sm:px-0 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          À fazer
        </h1>
      </div>

      {/* Priority Sections */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="space-y-1">
            {/* Priority Button */}
            <button
              onClick={() => togglePriority(category)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors duration-200 ${getPriorityColor(
                category
              )} ${
                draggedId &&
                tasks.find((t) => t.id === draggedId)?.category !== category
                  ? "ring-2 ring-blue-400 ring-opacity-50"
                  : ""
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropOnPriority(e, category)}
            >
              <div className="flex items-center gap-3">
                {getPriorityIcon(category)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 uppercase">
                  {category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {
                    tasks.filter(
                      (task) => task.category === category && !task.completed
                    ).length
                  }
                </span>
                {expandedPriorities[category] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {/* Tasks List - Collapsible */}
            {expandedPriorities[category] && (
              <div
                className={`ml-4 space-y-2 transition-colors duration-200 ${
                  draggedId &&
                  tasks.find((t) => t.id === draggedId)?.category !== category
                    ? "bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2"
                    : ""
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropOnPriority(e, category)}
              >
                {tasks
                  .filter(
                    (task) => task.category === category && !task.completed
                  )
                  .map((task) => (
                    <div
                      key={task.id}
                      className="group p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-move"
                      draggable
                      onDragStart={() => onDragStart(task.id)}
                      onDragOver={(e) => onDragOver(e, task.id)}
                      onDragEnd={onDragEnd}
                    >
                      {editingId === task.id ? (
                        <div className="space-y-3">
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
                              <SelectValue placeholder="Prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  <div className="flex items-center gap-2">
                                    {getPriorityIcon(cat)}
                                    <span>Prioridade {cat}</span>
                                  </div>
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
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            id={`task-${task.id}`}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`text-sm leading-relaxed flex-1 cursor-pointer ${
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
                              className="h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
                              className="h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 uppercase">
              Feito ({completedTasks})
            </span>
            {showCompletedTasks ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showCompletedTasks && (
            <div className="ml-4 space-y-2">
              {tasks
                .filter((task) => task.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="group p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 line-through flex-1">
                        {task.text}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                          className="h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddTaskModal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-2xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Adicionar Nova Tarefa
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Prioridade
                </label>
                <Select
                  value={newCategory}
                  onValueChange={(val) => setNewCategory(val as string)}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                    <SelectValue placeholder="Selecionar prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(cat)}
                          <span>Prioridade {cat}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Descrição da Tarefa
                </label>
                <Input
                  className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escreva uma nova tarefa..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={addTask}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!newTask.trim()}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewTask("");
                    setShowAddTaskModal(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
