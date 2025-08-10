// types/feature.ts
import { TaskItem } from '@/types/task'

export type Feature = {
    id: string
    name: string
    function: string
    price: number
    duration: string
    approvalStatus: 'draft' | 'waiting' | 'approved'
    deletionRequest?: boolean
    requirements?: RequirementItem[]
    isMarkedForDiscussion?: boolean
    discussionNote?: string
    isDiscussionResolved: false,
    discussionStatus: 'open' | 'close'
    tasks?: TaskItem[]
}

export type RequirementItem = {
    id: string
    title: string
    status?: 'pending' | 'approved'
}