"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Priority, Status, Prisma } from "@prisma/client";

export async function getTasks(filters?: {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const whereClause: Prisma.TaskWhereInput = {
    userId: session.user.id,
  };

  // Search filter (title or description)
  if (filters?.search) {
    whereClause.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Status filter
  if (filters?.status && filters.status !== "ALL") {
    whereClause.status = filters.status as Status;
  }

  // Priority filter
  if (filters?.priority && filters.priority !== "ALL") {
    whereClause.priority = filters.priority as Priority;
  }

  // Determine Prisma orderBy clause
  let orderBy: Prisma.TaskOrderByWithRelationInput[] = [{ createdAt: "desc" }];

  switch (filters?.sort) {
    case "DUE_DATE_ASC":
      // Closest due date first, nulls at bottom, tie-breaker alphabetical
      orderBy = [
        { dueDate: { sort: "asc", nulls: "last" } },
        { title: "asc" },
      ];
      break;
    case "DUE_DATE_DESC":
      // Furthest due date first, nulls at bottom, tie-breaker alphabetical
      orderBy = [
        { dueDate: { sort: "desc", nulls: "last" } },
        { title: "asc" },
      ];
      break;
    case "PRIORITY_DESC":
      // Note: Order depends on Prisma Enum order or fallback
      orderBy = [{ priority: "desc" }, { title: "asc" }];
      break;
    case "TITLE_ASC":
      orderBy = [{ title: "asc" }];
      break;
    case "CREATED_ASC":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "CREATED_DESC":
    default:
      orderBy = [{ createdAt: "desc" }];
      break;
  }

  return await prisma.task.findMany({
    where: whereClause,
    orderBy,
    include: { category: true, subtasks: true },
  });
}

export async function getTaskStats() {
  const session = await auth();
  if (!session?.user?.id) return { total: 0, completed: 0, inProgress: 0, todo: 0, urgent: 0 };

  const [total, completed, inProgress, todo, urgent] = await Promise.all([
    prisma.task.count({ where: { userId: session.user.id } }),
    prisma.task.count({ where: { userId: session.user.id, status: Status.DONE } }),
    prisma.task.count({ where: { userId: session.user.id, status: Status.IN_PROGRESS } }),
    prisma.task.count({ where: { userId: session.user.id, status: Status.TODO } }),
    prisma.task.count({ where: { userId: session.user.id, priority: Priority.URGENT } }),
  ]);

  return { total, completed, inProgress, todo, urgent };
}

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = (formData.get("priority") as Priority) || Priority.MEDIUM;
  const status = (formData.get("status") as Status) || Status.TODO;
  const dueDateRaw = formData.get("dueDate") as string;

  if (!title) throw new Error("Title is required");

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/tasks");
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = (formData.get("priority") as Priority) || Priority.MEDIUM;
  const status = (formData.get("status") as Status) || Status.TODO;
  const dueDateRaw = formData.get("dueDate") as string;

  if (!title) throw new Error("Title is required");

  await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    },
  });

  revalidatePath("/tasks");
}

export async function updateTaskStatus(taskId: string, status: Status) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status },
  });

  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  });

  revalidatePath("/tasks");
}