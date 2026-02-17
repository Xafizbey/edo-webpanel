import { cookies } from 'next/headers';
import { WEB_API_URL, TOKEN_COOKIE } from '@/lib/config';

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  const headers = new Headers(init?.headers);

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${WEB_API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });
}

export async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message ?? 'Request failed';
    throw new Error(message);
  }
  return data as T;
}
