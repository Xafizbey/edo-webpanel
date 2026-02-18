import { cookies } from 'next/headers';
import { TOKEN_COOKIE, requireApiBaseUrl } from '@/lib/config';

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  const headers = new Headers(init?.headers);

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let apiBase: string;
  try {
    apiBase = requireApiBaseUrl();
  } catch {
    return new Response(JSON.stringify({ error: { code: 'MISCONFIGURED', message: 'WEB_API_URL is not configured' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    return await fetch(`${apiBase}${path}`, {
      ...init,
      headers,
      cache: 'no-store'
    });
  } catch {
    return new Response(
      JSON.stringify({ error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Backend API is unreachable' } }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message ?? 'Request failed';
    throw new Error(message);
  }
  return data as T;
}
