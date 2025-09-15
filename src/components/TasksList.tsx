"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TasksList() {
  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Hoje, {today}</h1>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-widest">
          DESIGN
        </h2>
        <Card className="p-4 flex items-center gap-3">
          <Checkbox id="task-1" />
          <label htmlFor="task-1" className="text-base">
            Create icons for a dashboard
          </label>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Checkbox id="task-2" />
          <label htmlFor="task-2" className="text-base">
            Prepare a design presentation
          </label>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-widest">
          PERSONAL
        </h2>
        <Card className="p-4 flex items-center gap-3">
          <Checkbox id="task-3" />
          <label htmlFor="task-3" className="text-base">
            Stretch for 15 minutes
          </label>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Checkbox id="task-4" />
          <label htmlFor="task-4" className="text-base">
            Plan your meal
          </label>
        </Card>
        <Card className="p-4 flex items-start gap-3">
          <Checkbox id="task-5" />
          <label htmlFor="task-5" className="text-base leading-snug">
            Review daily goals before sleeping. <br />
            Add some new if time permits
          </label>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-widest">
          HOUSE
        </h2>
        <Card className="p-4 flex items-center gap-3">
          <Checkbox id="task-6" />
          <label htmlFor="task-6" className="text-base">
            Water indoor plants
          </label>
        </Card>
      </div>

      <div className="flex gap-2 pt-4">
        <Input placeholder="Write a task..." />
        <Button>Add</Button>
      </div>
    </div>
  );
}
