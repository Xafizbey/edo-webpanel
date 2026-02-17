import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { backendFetch, parseJsonOrThrow } from '@/lib/server-proxy';
import { TOKEN_COOKIE } from '@/lib/config';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN';
  department: string;
}

export async function requireAdmin(): Promise<AdminUser> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) {
    redirect('/login?reason=no_access');
  }

  const meResp = await backendFetch('/auth/me');
  if (!meResp.ok) {
    redirect('/login?reason=no_access');
  }

  const me = await parseJsonOrThrow<{ id: string; fullName: string; email: string; role: string; department: string }>(
    meResp
  );

  if (me.role !== 'ADMIN') {
    redirect('/login?reason=no_access');
  }

  return me as AdminUser;
}
