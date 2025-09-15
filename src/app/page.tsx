import TasksList from "@/components/TasksList";

export default function Home() {
  return (
    <div className="p-4 items-center bg-amber-50 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
        Gerenciador de Tarefas
      </h1>
      <TasksList />
    </div>
  );
}
