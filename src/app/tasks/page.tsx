import { getTasks } from "@/app/actions/tasks";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskItem } from "@/components/task-item";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <CreateTaskDialog />
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
            No tasks found. Click "Add Task" to create your first task!
          </div>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}