export interface UpdateTaskPayload {
  userId: string;
  taskId: string;
  title?: string;
  body?: string;
  deadlineTime?: string;
  deadlineHour?: string;
}