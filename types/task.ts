// types/task.ts

export interface TaskItem {
    id: string;
    featureId: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    deadline?: string
    createdAt: string;
    updatedAt: string;
  }