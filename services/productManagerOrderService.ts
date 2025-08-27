// src/services/productManagerOrderService.ts
import { cookies } from 'next/headers';
import { Order, Feature, Requirement } from '@/types/order';

export async function getOrders({ cookie }: { cookie: string }): Promise<{ data: Order[] | null }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/orders/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: null };
  }
}

export async function getOrderById(id: string): Promise<{ data: Order | null }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/orders/${id}`, {
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
    return { data: data || null }; // Adjust based on backend response structure
  } catch (error) {
    console.error('Error fetching order:', error);
    return { data: null };
  }
}

export async function addFeature(orderId: string, feature: Partial<Feature>): Promise<{ data: Feature | null }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/orders/${orderId}/features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
      body: JSON.stringify(feature),
    });

    if (!response.ok) {
      throw new Error('Failed to add feature');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    console.error('Error adding feature:', error);
    return { data: null };
  }
}

export async function updateFeature(featureId: string, feature: Partial<Feature>): Promise<{ data: Feature | null }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/features/${featureId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
      body: JSON.stringify(feature),
    });

    if (!response.ok) {
      throw new Error('Failed to update feature');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    console.error('Error updating feature:', error);
    return { data: null };
  }
}

export async function deleteFeature(featureId: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/features/${featureId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete feature');
    }
  } catch (error) {
    console.error('Error deleting feature:', error);
    throw error;
  }
}

export async function addRequirement(featureId: string, requirement: { title: string; status: string }): Promise<{ data: Requirement | null }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/features/${featureId}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
      body: JSON.stringify(requirement),
    });

    if (!response.ok) {
      throw new Error('Failed to add requirement');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    console.error('Error adding requirement:', error);
    return { data: null };
  }
}

export async function updateRequirement(requirementId: string, requirement: { title: string; status: string }): Promise<{ data: Requirement | null }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/requirements/${requirementId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
      body: JSON.stringify(requirement),
    });

    if (!response.ok) {
      throw new Error('Failed to update requirement');
    }

    const data = await response.json();
    return { data: data.data || null };
  } catch (error) {
    console.error('Error updating requirement:', error);
    return { data: null };
  }
}

// Existing functions (getOrders, getOrderById, addFeature, updateFeature, deleteFeature, addRequirement, updateRequirement, deleteRequirement) remain as provided in your example.

// Add deleteOrder (placeholder until backend implements)
export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-manager/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete order' };
  }
}

export async function deleteRequirement(require