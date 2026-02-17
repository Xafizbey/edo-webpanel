import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, WEB_API_URL } from '@/lib/config';

export function tokenFromCookie() {
  return cookies().get(TOKEN_COOKIE)?.value;
}

export function unauthorizedResponse(message = 'Нет доступа') {
  return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 401 });
}

export async function forwardWithToken(path: string, init?: RequestInit) {
  const token = tokenFromCookie();
  if (!token) return unauthorizedResponse();

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${WEB_API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json'
    }
  });
}
