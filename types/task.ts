export type TaskItem = {
    id: string
    title: string
    status: 'todo' | 'in-progress' | 'done'
    deadline?: string
}