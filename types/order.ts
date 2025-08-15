// types/order.ts
import { Onboarding } from '@/types/onboarding'
import { Feature  } from '@/types/feature'
import { PricingProposal } from './pricing-proposal'

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
    budgetPrice?: number
    designPreference?: {
        color: string
        style: string
    }
    features?: Feature[]
    totalPriceFeatures?: number;
    onboarding?: Onboarding
    pricingProposals?: PricingProposal[]
    totalPriceFinal?: number;
    pricingStatus?: 'negotiating' | 'confirmed'
    paymentTerms?: 'full' | 'installments' | 'milestones'
    paymentStatus?: 'pending' | 'paid'
}

export interface ProductManagerResponse<T> {
    status: 'success' | 'error';
    message: string;
    data?: T;
  }