import { getTasks, getTaskStats } from "@/app/actions/tasks";
import { TaskItem } from "@/components/task-item";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskFilters } from "@/components/task-filters";
import { TaskStats } from "@/components/task-stats";
import { TaskCalendar } from "@/components/task-calendar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutList, Calendar as CalendarIcon } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
    view?: string;
  }>;
}

export default async function TasksPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const isCalendarView = searchParams.view === "calendar";

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
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="border rounded-md p-1 bg-muted flex gap-1">
            <Link href="?view=list">
              <Button
                variant={!isCalendarView ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <LayoutList className="h-3.5 w-3.5 mr-1" /> List
              </Button>
            </Link>
            <Link href="?view=calendar">
              <Button
                variant={isCalendarView ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-1" /> Calendar
              </Button>
            </Link>
          </div>
          <CreateTaskDialog />
        </div>
      </div>

      {/* Analytics Summary */}
      <TaskStats stats={stats} />

      {/* Render View */}
      {isCalendarView ? (
        <TaskCalendar tasks={tasks} />
      ) : (
        <>
          <TaskFilters />
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-card/50 text-muted-foreground">
                No tasks found. Try adjusting your search filters or create a new task!
              </div>
            ) : (
              tasks.map((task) => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}