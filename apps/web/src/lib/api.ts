import { getSession } from 'next-auth/react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const token = (session?.user as any)?.accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: globalThis.Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  get: async (path: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, { headers });
    return handleResponse(res);
  },

  post: async (path: string, body?: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  },

  put: async (path: string, body?: any) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  },

  delete: async (path: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(res);
  },
};
