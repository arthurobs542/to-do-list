import HeaderTask from "@/components/HeaderTask";
import TasksList from "@/components/TasksList";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="p-4 items-center bg-gray-200 min-h-screen flex flex-col text-center">
      <div className="w-full max-w-2xl">
        <HeaderTask />
        <ThemeToggle />
        <TasksList />
      </div>
    </main>
  );
}
