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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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

  // Task handlers
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

  return (
    <div className="max-w-md mx-auto p-2 space-y-6 ">
      <div className="space-y-2 bg-amber-50 h-[300px] overflow-y-auto p-4 rounded-md shadow-sm">
        <Accordion
          type="multiple"
          defaultValue={["Geral"]}
          className="w-full  rounded-md"
        >
          {categories.map((category) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>
                {editingCategory === category ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-32"
                    />
                    <Button size="sm" onClick={saveEditCategory}>
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
                  <div className="flex items-center gap-2 w-full ">
                    <span className="text-sm font-semibold text-muted-foreground tracking-widest">
                      {category}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditCategory(category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCategory(category)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.category === category)
                    .map((task) => (
                      <Card
                        key={task.id}
                        className="p-4 flex items-start gap-2 cursor-move"
                        draggable
                        onDragStart={() => onDragStart(task.id)}
                        onDragOver={(e) => onDragOver(e, task.id)}
                        onDragEnd={onDragEnd}
                      >
                        {editingId === task.id ? (
                          <div className="flex flex-col gap-2 w-full">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="mb-2"
                            />
                            <Select
                              value={editCategory}
                              onValueChange={(val) =>
                                setEditCategory(val as string)
                              }
                            >
                              <SelectTrigger className="w-full bg-white">
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
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(task.id)}
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
                          <div className="flex items-center gap-2 w-full">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              id={`task-${task.id}`}
                            />
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`text-base leading-snug flex-1 ${
                                task.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {task.text}
                            </label>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(task)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="fixed bottom-5 left-5 right-5 flex flex-col gap-4 bg-white shadow-xl rounded-md px-5 py-6 max-h-100">
        <Select
          value={newCategory}
          onValueChange={(val) => setNewCategory(val as string)}
        >
          <SelectTrigger className="w-full bg-white">
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
        <Input
          className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Escreva uma nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} className="flex-1">
          Criar Tarefa
        </Button>
        <Button variant="outline" onClick={() => setShowCategoryModal(true)}>
          Nova Categoria
        </Button>
        {showCategoryModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px] flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Criar Nova Categoria</h2>
              <Input
                placeholder="Nome da categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={addCategory}>Criar</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewCategoryName("");
                    setShowCategoryModal(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
