"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Map tasks to their formatted local date string (YYYY-MM-DD)
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.dueDate) return acc;
    const d = new Date(task.dueDate);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  const daysGrid = [];
  // Empty slots for days before start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(day);
  }

  return (
    <div className="border rounded-lg bg-card p-4 space-y-4">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground border-b pb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 min-h-[350px]">
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="p-2 min-h-[70px] bg-muted/10 rounded" />;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasksByDate[dateKey] || [];
          const isToday =
            new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={dateKey}
              className={`p-1.5 min-h-[75px] border rounded transition-colors ${
                isToday ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <div className="text-xs font-bold mb-1 text-right text-muted-foreground">
                <span className={isToday ? "bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full" : ""}>
                  {day}
                </span>
              </div>
              <div className="space-y-1">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="text-[10px] p-1 rounded bg-secondary text-secondary-foreground truncate font-medium border"
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}