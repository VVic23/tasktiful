"use client";

import { useState } from "react";
import { updateTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { Task } from "@prisma/client";

export function EditTaskDialog({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  // Format date to YYYY-MM-DD for standard <input type="date" />
  const initialDueDate = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";

  async function handleSubmit(formData: FormData) {
    await updateTask(task.id, formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
            <Input name="title" defaultValue={task.title} required />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea
              name="description"
              defaultValue={task.description || ""}
              placeholder="Description (optional)..."
              className="w-full min-h-[80px] p-2 border rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select
                name="status"
                defaultValue={task.status}
                className="w-full p-2 border rounded-md bg-background text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <select
                name="priority"
                defaultValue={task.priority}
                className="w-full p-2 border rounded-md bg-background text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
            <input
              type="date"
              name="dueDate"
              defaultValue={initialDueDate}
              className="w-full p-2 border rounded-md bg-background text-sm"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}