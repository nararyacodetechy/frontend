// src/services/userOrderService.ts
import { cookies } from 'next/headers';
import { Order } from '@/types/order';

export async function getUserOrders(): Promise<{ data: Order[] | null; error?: string }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch orders' };
  }
}

export async function getOrderDetails(id: string): Promise<{ data: Order | null; error?: string }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    const data = await response.json();
    return { data: data || null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch order' };
  }
}

export async function createOrder(order: Partial<Order>): Promise<{ data: Order | null; error?: string }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    return { data: null, error: 'Failed to create order' };
  }
}