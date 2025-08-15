// types/feature.ts
import { TaskItem } from '@/types/task'

export interface Feature {
    id: string;
    orderId: string;
    name: string;
    function: string;
    price: number;
    duration: string;
    approvalStatus: 'draft' | 'waiting' | 'approved';
    deletionRequest: boolean;
    isMarkedForDiscussion: boolean;
    discussionNote?: string;
    discussionStatus: 'open' | 'close';
    createdAt: string;
    updatedAt: string;
    requirements: RequirementItem[];
    tasks: TaskItem[];
}

export type RequirementItem = {
    id: string;
    featureId: string;
    title: string;
    status?: 'pending' | 'approved';
    createdAt: string;
    updatedAt: string;
}