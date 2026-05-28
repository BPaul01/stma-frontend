import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { ClockLoader } from "react-spinners";
import { getTask } from "@/api/tasks";
import { updateTask } from "@/api/tasks";

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [completeBy, setCompleteBy] = useState<string>("");

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      try {
        const response = await getTask(id as string);
        
        // Safely extract the task item, handling potential API wrappers (e.g. { item: {} }, { Item: {} }, or an array)
        const taskData = response.items?.[0] || response.item || response.Item || response;

        setTitle(taskData.title || "");
        setBody(taskData.body || "");
        
        // Map the backend time formats to ISO strings used by the component
        setCreatedAt(taskData.createdTime && taskData.createdHour 
          ? `${taskData.createdTime}T${taskData.createdHour}:00Z` 
          : taskData.createdAt || "");
          
        setCompleteBy(taskData.deadlineTime && taskData.deadlineHour 
          ? `${taskData.deadlineTime}T${taskData.deadlineHour}:00Z` 
          : taskData.completeBy || "");
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadTask();
    }
  }, [id, user?.userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTask({
        userId: user?.userId || "",
        taskId: id || "",
        title,
        body,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClockLoader color="#888" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))} 
          disabled={isSaving || (isEditing && !title.trim())}
        >
          {isEditing ? (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </>
          ) : (
            "Edit Task"
          )}
        </Button>
      </div>

      <div className="mb-8 border-b pb-6">
        {isEditing ? (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Task Title</FieldLabel>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-xl font-bold"
              />
            </Field>
          </FieldGroup>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
              {createdAt && (
                <div>
                  <span className="font-semibold">Created: </span>
                  {format(parseISO(createdAt), "PPp")}
                </div>
              )}
              {completeBy && (
                <div>
                  <span className="font-semibold">Complete By: </span>
                  {format(parseISO(completeBy), "PPp")}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        {isEditing ? (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="body">Task Body (Markdown)</FieldLabel>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Field>
          </FieldGroup>
        ) : body ? (
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {body}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No content provided.</p>
        )}
      </div>
    </div>
  );
}