"use client";

import { useState } from "react";
import { updateTaskStatus, deleteTask } from "@/app/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Task, Category, Status } from "@prisma/client";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { SubtaskList } from "@/components/subtask-list";

type TaskWithRelations = Task & {
  category?: Category | null;
  subtasks?: Task[];
};

export function TaskItem({ task }: { task: TaskWithRelations }) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isDone = task.status === Status.DONE;

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusStyles: Record<Status, { label: string; class: string }> = {
    TODO: { label: "To Do", class: "bg-secondary text-secondary-foreground" },
    IN_PROGRESS: { label: "In Progress", class: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    DONE: { label: "Done", class: "bg-green-500/10 text-green-500 border-green-500/20" },
    BACKLOG: { label: "Backlog", class: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" },
    CANCELLED: { label: "Cancelled", class: "bg-red-500/10 text-red-500 border-red-500/20" },
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isDone}
            onCheckedChange={(checked) =>
              updateTaskStatus(task.id, checked ? Status.DONE : Status.TODO)
            }
          />
          <div>
            <p className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {task.description && (
                <p className="text-xs text-muted-foreground">{task.description}</p>
              )}
              {formattedDueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Calendar className="h-3 w-3" />
                  {formattedDueDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusStyles[task.status].class}>
            {statusStyles[task.status].label}
          </Badge>
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <EditTaskDialog task={task} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Toggle button positioned to the right of the trash icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="h-8 w-8 text-muted-foreground"
            title="Toggle Subtasks"
          >
            {showSubtasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Subtask list shown only when toggled open */}
      {showSubtasks && (
        <SubtaskList taskId={task.id} subtasks={task.subtasks || []} />
      )}
    </div>
  );
}