import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, WEB_API_URL } from '@/lib/config';

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${WEB_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  });

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
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 8
  });

  return res;
}
