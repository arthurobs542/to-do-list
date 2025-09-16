import TasksList from "@/components/TasksList";

export default function Home() {
  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="p-4 items-center bg-amber-50 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
        Hoje,
        <span className="text-muted-foreground text-2xl "> {today}</span>
      </h1>

      <TasksList />
    </div>
  );
}
