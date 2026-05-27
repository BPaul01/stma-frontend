export interface CreateTaskPayload {
  userId: string;
  title: string;
  body: string;
  deadlineTime: string;
  deadlineHour: string;
}