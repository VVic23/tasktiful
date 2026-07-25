import { getTasks, getTaskStats } from "@/app/actions/tasks";
import { TaskItem } from "@/components/task-item";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskFilters } from "@/components/task-filters";
import { TaskStats } from "@/components/task-stats";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }>;
}

export default async function TasksPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const [tasks, stats] = await Promise.all([
    getTasks(searchParams),
    getTaskStats(),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, filter, and track your active tasks.
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {/* Analytics Dashboard Cards */}
      <TaskStats stats={stats} />

      {/* Search and Filter Controls */}
      <TaskFilters />

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card/50 text-muted-foreground">
            No tasks found. Try adjusting your search filters or create a new task!
          </div>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}