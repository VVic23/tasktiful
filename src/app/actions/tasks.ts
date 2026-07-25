"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Priority, Status } from "@prisma/client";

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, subtasks: true },
  });
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