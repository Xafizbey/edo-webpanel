'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';

export function DocumentFiltersSheet() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState(params.get('status') ?? '');
  const [type, setType] = useState(params.get('type') ?? '');
  const [department, setDepartment] = useState(params.get('department') ?? '');
  const [q, setQ] = useState(params.get('q') ?? '');

  const apply = () => {
    const next = new URLSearchParams(params.toString());
    setOrDelete(next, 'status', status);
    setOrDelete(next, 'type', type);
    setOrDelete(next, 'department', department);
    setOrDelete(next, 'q', q);
    next.set('page', '1');
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Фильтры</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <h3 className="text-lg font-semibold">Фильтры</h3>
        </SheetHeader>
        <div className="space-y-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по заголовку" />
          <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Департамент" />
          <label className="text-sm">Статус</label>
          <select className="h-10 w-full rounded-md border px-3" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            {['DRAFT', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'ARCHIVED'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label className="text-sm">Тип</label>
          <select className="h-10 w-full rounded-md border px-3" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Все</option>
            {['LEAVE_REQUEST', 'BUSINESS_TRIP', 'PURCHASE_REQUEST'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Button className="w-full" onClick={apply}>
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}
