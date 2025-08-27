// src/types/order.ts
export interface Order {
    id: string;
    clientId: string;
    clientName: string | null;
    username: string | null;
    nik: string | null;
    email: string;
    address: string | null;
    phone: string | null;
    company: string | null;
    imageProfile: string | null;
    orderName: string;
    orderNumber: string;
    projectType: string;
    projectDetail: string;
    reference: string | null;
    image: string | null;
    imgIdOrder: string | null;
    status: 'under-review' | 'waiting' | 'analysis-finished' | 'completed';
    paymentMethod: string | null;
    paymentProof: string | null;
    budgetPrice: string; // Backend uses string
    designPreference: {
      color: string | null;
      style: string | null;
    };
    totalPriceFeatures: string; // Backend uses string
    totalPriceFinal: string; // Backend uses string
    pricingStatus: 'negotiating' | 'confirmed' | null;
    paymentTerms: 'full' | 'installments' | 'milestones' | null;
    paymentStatus: 'pending' | 'paid' | null;
    features: Feature[];
    pricingProposals: PricingProposal[];
    onboarding: Onboarding | null;
  }
  
  export interface Feature {
    id: string;
    orderId: string;
    name: string;
    function: string;
    price: string; // Backend uses string
    duration: string;
    approvalStatus: 'draft' | 'waiting' | 'approved';
    deletionRequest: boolean;
    isMarkedForDiscussion: boolean;
    discussionNote: string | null;
    discussionStatus: 'open' | 'resolved' | 'archived';
    requirements: Requirement[];
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Requirement {
    id: string;
    featureId: string;
    title: string;
    status: 'pending' | 'approved';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Task {
    id: string;
    featureId: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    deadline: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PricingProposal {
    id: string;
    orderId: string;
    amount: string;
    discount: string;
    taxRate: string;
    commissionRate: string;
    notes: string | null;
    proposedBy: 'PM' | 'Client';
    createdAt: string;
  }
  
  export interface Onboarding {
    id: string;
    status: 'initial' | 'meeting_scheduled' | 'analysis_complete' | 'completed';
    analysisNotes: string | null;
    meetings: Meeting[];
  }
  
  export interface Meeting {
    id: string;
    onboardingId: string;
    date: string;
    time: string;
    link: string | null;
    notes: string | null;
    isAdHoc: boolean;
    createdAt: string;
  }