"use client";

import { useState, useEffect } from "react";
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
import { createTask, getTasks, deleteTask } from "@/api/tasks";
import { ClockLoader } from "react-spinners";
import type { ApiTaskItem } from "@/types/apiTaskItem";

export default function DashboardPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskBody, setNewTaskBody] = useState("");
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>();
  const [newTaskTime, setNewTaskTime] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.signInDetails?.loginId || user?.username;

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getTasks();

        if (data.items) {
          const mappedTasks: Task[] = data.items.map((item: ApiTaskItem) => ({
            id: item.taskId,
            title: item.title,
            createdAt: item.createdTime && item.createdHour 
              ? `${item.createdTime}T${item.createdHour}:00Z` 
              : new Date().toISOString(),
            completeBy: item.deadlineTime && item.deadlineHour 
              ? `${item.deadlineTime}T${item.deadlineHour}:00Z` 
              : undefined,
          }));
          setTasks(mappedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreateTaskDialogChange = (open: boolean) => {
    if (open) {
      const now = new Date();
      const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      setNewTaskDate(now);
      setNewTaskTime(futureTime.toTimeString().split(" ")[0].substring(0, 5));
    }
    setCreateTaskDialogOpen(open);
  };

  const handleDeleteTask = async (id: string) => {
    const previousTasks = [...tasks];
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));

    try {
      await deleteTask({
        userId: user?.userId || "",
        taskId: id,
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      setTasks(previousTasks);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      const deadlineTime = newTaskDate ? format(newTaskDate, "yyyy-MM-dd") : "";
      const deadlineHour = newTaskTime || "";

      const response = await createTask({
        userId: user?.userId || "",
        title: newTaskTitle,
        body: newTaskBody,
        deadlineTime,
        deadlineHour,
      });

      console.log("Data returned from createTask API:", response);

      let completeBy = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Default 7 days from now
      if (newTaskDate) {
        const [hours, minutes, seconds] = newTaskTime.split(':').map(Number);
        const combinedDate = new Date(newTaskDate);
        combinedDate.setHours(hours || 0, minutes || 0, seconds || 0);
        completeBy = combinedDate.toISOString();
      }

      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        title: newTaskTitle,
        createdAt: new Date().toISOString(),
        completeBy,
      };
      setTasks((currentTasks) => [...currentTasks, newTask]);
      setNewTaskTitle("");
      setNewTaskBody("");
      setNewTaskDate(undefined);
      setNewTaskTime("");
      setCreateTaskDialogOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsCreating(false);
    }
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
              <div className="grid gap-2">
                <Label htmlFor="task-body">Description</Label>
                <Input
                  id="task-body"
                  value={newTaskBody}
                  onChange={(e) => setNewTaskBody(e.target.value)}
                  placeholder="e.g. Test the POST endpoint using Postman."
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
                setNewTaskBody("");
                setNewTaskDate(undefined);
                setNewTaskTime("");
              }}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateTask();
                }}
                disabled={!newTaskTitle.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <ClockLoader color="#888" size={40} />
          </div>
        ) : tasks.length === 0 ? (
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