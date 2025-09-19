import TasksList from "@/components/TasksList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <TasksList />
      </div>
    </main>
  );
}
