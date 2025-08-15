// productManagerService.ts
import { Feature, RequirementItem } from '@/types/feature';
import { Onboarding, OnboardingMeeting } from '@/types/onboarding';
import { Order, ProductManagerResponse } from '@/types/order';
import { PricingProposal } from '@/types/pricing-proposal';
import { TaskItem } from '@/types/task';

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// Helper function to get the auth token from cookies
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies['token'] || null;
};

// Orders
export const getOrders = async (): Promise<ProductManagerResponse<Order[]>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getOrderById = async (id: string): Promise<ProductManagerResponse<Order>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createOrder = async (data: Partial<Order>): Promise<ProductManagerResponse<Order>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateOrder = async (id: string, data: Partial<Order>): Promise<ProductManagerResponse<Order>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteOrder = async (id: string): Promise<ProductManagerResponse<void>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Features
export const addFeature = async (orderId: string, data: Partial<Feature>): Promise<ProductManagerResponse<Feature>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${orderId}/features`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateFeature = async (featureId: string, data: Partial<Feature>): Promise<ProductManagerResponse<Feature>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/features/${featureId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteFeature = async (featureId: string): Promise<ProductManagerResponse<void>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/features/${featureId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Requirements
export const addRequirement = async (featureId: string, data: Partial<RequirementItem>): Promise<ProductManagerResponse<RequirementItem>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/features/${featureId}/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateRequirement = async (requirementId: string, data: Partial<RequirementItem>): Promise<ProductManagerResponse<RequirementItem>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/requirements/${requirementId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteRequirement = async (requirementId: string): Promise<ProductManagerResponse<void>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/requirements/${requirementId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Pricing Proposals
export const addPricingProposal = async (orderId: string, data: Partial<PricingProposal>): Promise<ProductManagerResponse<PricingProposal>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${orderId}/pricing-proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Onboarding
export const updateOnboarding = async (orderId: string, data: Partial<Onboarding>): Promise<ProductManagerResponse<Onboarding>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/orders/${orderId}/onboarding`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Onboarding Meetings
export const addOnboardingMeeting = async (onboardingId: string, data: Partial<OnboardingMeeting>): Promise<ProductManagerResponse<OnboardingMeeting>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/onboardings/${onboardingId}/meetings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Tasks
export const addTask = async (featureId: string, data: Partial<TaskItem>): Promise<ProductManagerResponse<TaskItem>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/features/${featureId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateTask = async (taskId: string, data: Partial<TaskItem>): Promise<ProductManagerResponse<TaskItem>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteTask = async (taskId: string): Promise<ProductManagerResponse<void>> => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_BASE_URL}/product-manager/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};