// types/pricing-proposal.ts

export interface PricingProposal {
    id: string;
    orderId: string;
    amount: number;
    discount: number;
    taxRate: number;
    commissionRate: number;
    notes?: string;
    proposedBy: 'PM' | 'Client';
    createdAt: string;
}