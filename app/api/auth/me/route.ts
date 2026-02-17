import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, requireApiBaseUrl } from '@/lib/config';
import { tokenFromCookie } from '@/lib/route-helpers';

export async function GET() {
  const token = tokenFromCookie();
  if (!token) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Нет доступа' } }, { status: 401 });
  }
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
    response = await fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Backend API is unreachable' } },
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.role !== 'ADMIN') {
    const res = NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Нет доступа' } }, { status: 403 });
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  return NextResponse.json(data);
}
