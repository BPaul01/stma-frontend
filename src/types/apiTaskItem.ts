export interface ApiTaskItem {
  taskId: string;
  title: string;
  createdTime: string;
  createdHour: string;
  deadlineTime?: string;
  deadlineHour?: string;
}