// types/order.ts

export type RequirementItem = {
    id: string
    title: string
    status?: 'pending' | 'approved' // tambahkan ini agar sesuai dummy
}

export type TaskItem = {
    id: string
    title: string
    status: 'todo' | 'in-progress' | 'done'
    deadline?: string
}

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
    tasks?: TaskItem[]
}

export type Order = {
    id: string
    clientName: string
    clientId: string
    username?: string
    nik?: string
    email?: string
    address?: string
    phone?: string
    company?: string
    imageProfile?: string
    orderName: string
    orderNumber: string
    projectType: string
    projectDetail: string
    reference: string
    image: string
    imgIdOrder?: string
    status: string
    createdAt?: string
    paymentMethod?: string
    paymentProof?: string
    totalPrice?: number
    designPreference?: {
        color: string
        style: string
    }
    features?: Feature[]
}
  