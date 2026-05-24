"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TrashIcon } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onDelete?: (id: string) => void;
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function TaskItem({ task, onDelete }: TaskItemProps) {
  return (
    <div className="grid grid-cols-[1fr_180px_180px_80px] gap-4 items-center py-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
      <div className="font-medium truncate pr-4">{task.title}</div>
      <div className="text-sm text-muted-foreground">{task.createdAt ? formatDateTime(task.createdAt) : "-"}</div>
      <div className="text-sm text-muted-foreground">{task.completeBy ? formatDateTime(task.completeBy) : "-"}</div>
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="shrink-0"
              aria-label={`Delete task ${task.title}`}
            >
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete?.(task.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}