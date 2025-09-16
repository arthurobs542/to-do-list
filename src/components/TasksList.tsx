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

type Task = {
  id: number;
  text: string;
  category: "DESIGN" | "PERSONAL" | "HOUSE";
  completed: boolean;
};

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      text: "Criar Design do projeto",
      category: "DESIGN",
      completed: false,
    },
    {
      id: 2,
      text: "Preparar apresentação",
      category: "DESIGN",
      completed: false,
    },
    {
      id: 3,
      text: "Alongar por 15 minutos",
      category: "PERSONAL",
      completed: false,
    },
    {
      id: 4,
      text: "Planejar sua refeição",
      category: "PERSONAL",
      completed: false,
    },
    {
      id: 5,
      text: "Revisar metas diárias antes de dormir. Adicionar novas se o tempo permitir",
      category: "PERSONAL",
      completed: false,
    },
    {
      id: 6,
      text: "Regar plantas internas",
      category: "HOUSE",
      completed: false,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<Task["category"]>("PERSONAL");

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

  const renderTasksByCategory = (category: Task["category"]) => (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground tracking-widest">
        {category}
      </h2>
      {tasks
        .filter((task) => task.category === category)
        .map((task) => (
          <Card key={task.id} className="p-4 flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              id={`task-${task.id}`}
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`text-base leading-snug ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.text}
            </label>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {renderTasksByCategory("DESIGN")}
      {renderTasksByCategory("PERSONAL")}
      {renderTasksByCategory("HOUSE")}

      {/* Add new task */}
      <div className="flex flex-col gap-3 pt-4">
        <Input
          placeholder="Write a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <div className="flex gap-2">
          <Select
            value={newCategory}
            onValueChange={(val) => setNewCategory(val as Task["category"])}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESIGN">Design</SelectItem>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="HOUSE">House</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={addTask} className="flex-1">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
