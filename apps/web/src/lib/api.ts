const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type ApiResult<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<ApiResult<T>> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Request failed');
  }

  return json;
}

// Convenience wrappers used across pages
export const api = {
  get: <T = unknown>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'GET', token }),
  post: <T = unknown>(path: string, body?: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, token }),
  put: <T = unknown>(path: string, body?: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, token }),
  patch: <T = unknown>(path: string, body?: unknown, token?: string) =>
    apiFetch<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, token }),
  delete: <T = unknown>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'DELETE', token }),
};

export const apiClient = api;
