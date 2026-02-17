'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface AdminShellProps {
  user: {
    fullName: string;
    email: string;
  };
  children: ReactNode;
}

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { href: '/admin/documents', label: 'Документы', icon: FileText, enabled: true },
  { href: '/admin/users', label: 'Пользователи', icon: Users, enabled: true },
  { href: '/admin/settings', label: 'Настройки', icon: Settings, enabled: true }
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-primary">
            <Shield className="h-5 w-5" />
            EDO Admin
          </div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                    active ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-4">
          <header className="flex items-center justify-between rounded-xl border border-border bg-card/95 p-3 shadow-sm">
            <div>
              <div className="text-sm text-muted-foreground">Админ-панель</div>
              <div className="font-semibold">Управление документооборотом</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user.fullName}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>{user.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
