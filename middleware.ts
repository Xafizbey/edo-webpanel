import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/config';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('reason', 'no_access');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
