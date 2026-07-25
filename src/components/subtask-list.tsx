"use client";

import { useState } from "react";
import { addSubtask, toggleSubtask, deleteSubtask } from "@/app/actions/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Task, Status } from "@prisma/client";

export function SubtaskList({ taskId, subtasks = [] }: { taskId: string; subtasks: Task[] }) {
  const [newTitle, setNewTitle] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addSubtask(taskId, newTitle);
    setNewTitle("");
  }

  const completedCount = subtasks.filter((s) => s.status === Status.DONE).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="mt-3 pt-3 border-t space-y-2">
      {subtasks.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Subtasks ({completedCount}/{subtasks.length})</span>
          <span>{progressPercent}% completed</span>
        </div>
      )}

      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Existing Subtasks */}
      <div className="space-y-1">
        {subtasks.map((subtask) => {
          const isDone = subtask.status === Status.DONE;
          return (
            <div key={subtask.id} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isDone}
                  onCheckedChange={(checked) => toggleSubtask(subtask.id, !!checked)}
                />
                <span className={isDone ? "line-through text-muted-foreground" : ""}>
                  {subtask.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSubtask(subtask.id)}
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Add Subtask Input */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 mt-2">
        <Input
          size={1}
          placeholder="Add a subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="h-8 text-xs"
        />
        <Button type="submit" size="sm" variant="secondary" className="h-8 px-2">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}