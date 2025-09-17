import TasksList from "@/components/TasksList";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="p-4 items-center bg-gray-200 min-h-screen flex flex-col text-center">
      <h1 className="text-3xl font-bold text-foreground mb-6 w-full max-w-2xl ">
        A fazer
        <span className="text-muted-foreground text-2xl block pt-1">
          {" "}
          {today}
        </span>
      </h1>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Suas Tarefas
        </h2>
        <p className="text-muted-foreground mb-6 text-left">
          Adicione tarefas para começar a organizar seu dia!
        </p>
        <ThemeToggle />
        <TasksList />
      </div>
    </div>
  );
}
