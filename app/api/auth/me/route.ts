import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, WEB_API_URL } from '@/lib/config';
import { tokenFromCookie } from '@/lib/route-helpers';

export async function GET() {
  const token = tokenFromCookie();
  if (!token) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Нет доступа' } }, { status: 401 });
  }

  const response = await fetch(`${WEB_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.role !== 'ADMIN') {
    const res = NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Нет доступа' } }, { status: 403 });
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  return NextResponse.json(data);
}
