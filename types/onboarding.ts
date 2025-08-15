// types/onboarding.ts

export type Onboarding = {
    id: string;
    orderId: string;
    status: 'initial' | 'meeting_scheduled' | 'analysis_complete' | 'completed'
    analysisNotes?: string;
    createdAt: string;
    updatedAt: string;
    meetings: OnboardingMeeting[];
}
  
export interface OnboardingMeeting {
    id: string;
    onboardingId: string;
    date: string;
    time: string;
    link?: string;
    notes?: string;
    isAdHoc?: boolean
    createdAt: string;
}