"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTransition } from "react";

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "ALL" && value !== "CREATED_DESC") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 my-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => updateParams("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            defaultValue={searchParams.get("status") || "ALL"}
            onChange={(e) => updateParams("status", e.target.value)}
            className="p-2 border rounded-md bg-background text-sm min-w-[120px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="BACKLOG">Backlog</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Priority Filter */}
          <select
            defaultValue={searchParams.get("priority") || "ALL"}
            onChange={(e) => updateParams("priority", e.target.value)}
            className="p-2 border rounded-md bg-background text-sm min-w-[120px]"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort Selector */}
          <select
            defaultValue={searchParams.get("sort") || "CREATED_DESC"}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="p-2 border rounded-md bg-background text-sm min-w-[150px] font-medium border-primary/30"
          >
            <option value="CREATED_DESC">Newest Created First</option>
            <option value="CREATED_ASC">Oldest Created First</option>
            <option value="DUE_DATE_ASC">Due Date (Soonest)</option>
            <option value="DUE_DATE_DESC">Due Date (Furthest)</option>
            <option value="PRIORITY_DESC">Highest Priority</option>
            <option value="TITLE_ASC">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}