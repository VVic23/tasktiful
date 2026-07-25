"use client";

import { updateTaskStatus, deleteTask } from "@/app/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Task, Category } from "@prisma/client";
import { EditTaskDialog } from "@/components/edit-task-dialog";

type TaskWithRelations = Task & {
  category?: Category | null;
  subtasks?: Task[];
};

export function TaskItem({ task }: { task: TaskWithRelations }) {
  const isDone = task.status === "DONE";

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-500",
    MEDIUM: "bg-yellow-500/10 text-yellow-500",
    HIGH: "bg-orange-500/10 text-orange-500",
    URGENT: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) =>
            updateTaskStatus(task.id, checked ? "DONE" : "TODO")
          }
        />
        <div>
          <p className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}