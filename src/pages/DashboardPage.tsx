"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { PlusIcon } from "lucide-react";
import { TaskItem } from "@/components/custom/TaskItem";
import type { Task } from "@/types/task";

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Review pull requests", createdAt: "2026-05-20T10:00:00Z", completeBy: "2026-05-25T17:00:00Z" },
  { id: "2", title: "Update documentation", createdAt: "2026-05-21T09:30:00Z", completeBy: "2026-05-26T12:00:00Z" },
  { id: "3", title: "Fix login bug", createdAt: "2026-05-22T14:15:00Z", completeBy: "2026-05-24T18:00:00Z" },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const handleDeleteTask = (id: string) => {
    // TODO: Replace with API service call
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const handleCreateTask = () => {
    // TODO: Replace with API service call / modal flow
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: "New Task",
      createdAt: new Date().toISOString(),
      completeBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    };
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome user! This is the dashboard page</h1>
        <Button onClick={handleCreateTask}>
          <PlusIcon data-icon="inline-start" />
          Create Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <Empty>
              <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
            </Empty>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[1fr_180px_180px_80px] gap-4 items-center font-semibold text-sm text-muted-foreground pb-3 border-b">
                  <div>Title</div>
                  <div>Created At</div>
                  <div>Complete By</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="flex flex-col">
                  {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onDelete={handleDeleteTask} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}