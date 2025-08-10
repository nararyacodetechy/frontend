export type Meeting = {
    id: string
    date: string
    time: string
    link: string
    notes: string
    isAdHoc?: boolean
}

export type Onboarding = {
    status: 'initial' | 'meeting_scheduled' | 'analysis_complete' | 'completed'
    meetings?: Meeting[]
    analysisNotes?: string
}