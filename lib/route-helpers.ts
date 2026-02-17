import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, requireApiBaseUrl } from '@/lib/config';

export function tokenFromCookie() {
  return cookies().get(TOKEN_COOKIE)?.value;
}

export function unauthorizedResponse(message = 'Нет доступа') {
  return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 401 });
}

export async function forwardWithToken(path: string, init?: RequestInit) {
  const token = tokenFromCookie();
  if (!token) return unauthorizedResponse();
  let apiBase: string;
  try {
    apiBase = requireApiBaseUrl();
  } catch {
    return NextResponse.json(
      { error: { code: 'MISCONFIGURED', message: 'WEB_API_URL is not configured' } },
      { status: 500 }
    );
  }

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(`${apiBase}${path}`, {
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
  } catch {
    return NextResponse.json(
      { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Backend API is unreachable' } },
      { status: 502 }
    );
  }
}
