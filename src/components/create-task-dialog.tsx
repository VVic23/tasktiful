"use client";

import { useState } from "react";
import { createTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (!newVal) {
      setDueDate("");
      return;
    }

    const [newDate] = newVal.split("T");
    const [oldDate] = dueDate ? dueDate.split("T") : [""];

    // If the date part changed (or was newly selected), default time to 23:59 (11:59 PM)
    if (newDate !== oldDate) {
      setDueDate(`${newDate}T23:59`);
    } else {
      // If the date stayed the same, the user is modifying the time portion
      setDueDate(newVal);
    }
  };

  async function handleSubmit(formData: FormData) {
    await createTask(formData);
    setDueDate("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title</label>
            <Input name="title" placeholder="Task title..." required />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
            <textarea
              name="description"
              placeholder="Description (optional)..."
              className="w-full min-h-[80px] p-2 border rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select
                name="status"
                defaultValue="TODO"
                className="w-full p-2 border rounded-md bg-background text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BACKLOG">Backlog</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <select
                name="priority"
                defaultValue="MEDIUM"
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
            <label className="text-xs text-muted-foreground mb-1 block">
              Due Date & Time (Defaults to 11:59 PM)
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={dueDate}
              onChange={handleDateTimeChange}
              className="w-full p-2 border rounded-md bg-background text-sm"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}