"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TaskItem } from "@/components/custom/TaskItem";
import type { Task } from "@/types/task";
import { useAuthenticator } from "@aws-amplify/ui-react";

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Review pull requests", createdAt: "2026-05-20T10:00:00Z", completeBy: "2026-05-25T17:00:00Z" },
  { id: "2", title: "Update documentation", createdAt: "2026-05-21T09:30:00Z", completeBy: "2026-05-26T12:00:00Z" },
  { id: "3", title: "Fix login bug", createdAt: "2026-05-22T14:15:00Z", completeBy: "2026-05-24T18:00:00Z" },
];

export default function DashboardPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>();
  const [newTaskTime, setNewTaskTime] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);

  const displayName = user?.signInDetails?.loginId || user?.username;

  const handleCreateTaskDialogChange = (open: boolean) => {
    if (open) {
      const now = new Date();
      const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      setNewTaskDate(now);
      setNewTaskTime(futureTime.toTimeString().split(" ")[0].substring(0, 5));
    }
    setCreateTaskDialogOpen(open);
  };

  const handleDeleteTask = (id: string) => {
    // TODO: Replace with API service call
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      return;
    }

    let completeBy = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Default 7 days from now
    if (newTaskDate) {
      const [hours, minutes, seconds] = newTaskTime.split(':').map(Number);
      const combinedDate = new Date(newTaskDate);
      combinedDate.setHours(hours || 0, minutes || 0, seconds || 0);
      completeBy = combinedDate.toISOString();
    }

    // TODO: Replace with API service call / modal flow
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: newTaskTitle,
      createdAt: new Date().toISOString(),
      completeBy,
    };
    setTasks((currentTasks) => [...currentTasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDate(undefined);
    setNewTaskTime("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {displayName ? `${displayName}'s Dashboard` : "Dashboard"}
        </h1>
        <AlertDialog open={isCreateTaskDialogOpen} onOpenChange={handleCreateTaskDialogChange}>
          <AlertDialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Task</AlertDialogTitle>
              <AlertDialogDescription>
                Please enter a title for the new task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Review pull requests"
                />
              </div>
              <FieldGroup className="flex-row">
                <Field className="flex-1">
                  <FieldLabel htmlFor="date-picker-optional">Deadline Date (Optional)</FieldLabel>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker-optional"
                        className="w-full justify-between font-normal"
                      >
                        {newTaskDate ? format(newTaskDate, "PPP") : "Select date"}
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTaskDate}
                        captionLayout="dropdown"
                        defaultMonth={newTaskDate}
                        onSelect={(date) => {
                          setNewTaskDate(date);
                          setIsDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field className="w-32">
                  <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                  <Input
                    type="time"
                    id="time-picker-optional"
                    value={newTaskTime || ""}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </Field>
              </FieldGroup>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setNewTaskTitle("");
                setNewTaskDate(undefined);
                setNewTaskTime("");
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
                Create
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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