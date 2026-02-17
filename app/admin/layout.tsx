import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { AdminShell } from '@/components/layout/admin-shell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell user={user}>{children}</AdminShell>;
}
