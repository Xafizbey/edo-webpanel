import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, requireApiBaseUrl } from '@/lib/config';

export async function POST(request: Request) {
  const body = await request.json();
  let apiBase: string;
  try {
    apiBase = requireApiBaseUrl();
  } catch {
    return NextResponse.json(
      { error: { code: 'MISCONFIGURED', message: 'WEB_API_URL is not configured' } },
      { status: 500 }
    );
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Backend API is unreachable' } },
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  if (data?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Нет доступа' } }, { status: 403 });
  }

  const res = NextResponse.json({ user: data.user });
  res.cookies.set(TOKEN_COOKIE, data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });

  return res;
}
