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
    tasks?: TaskItem[]
}

export type RequirementItem = {
    id: string
    title: string
}