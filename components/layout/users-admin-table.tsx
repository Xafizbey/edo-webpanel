'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: 'USER' | 'APPROVER' | 'ADMIN';
}

export function UsersAdminTable() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);

  const [selected, setSelected] = useState<User | null>(null);
  const [nextRole, setNextRole] = useState<User['role']>('USER');
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    role: 'USER' as User['role']
  });

  const load = async () => {
    setLoading(true);
    const response = await fetch('/api/users');
    const data = await response.json().catch(() => []);
    if (!response.ok) {
      toast.error(data?.error?.message ?? 'Не удалось загрузить пользователей');
      setLoading(false);
      return;
    }
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const v = q.toLowerCase();
    return items.filter((u) => u.fullName.toLowerCase().includes(v) || u.email.toLowerCase().includes(v));
  }, [items, q]);

  const applyRole = async () => {
    if (!selected) return;

    const response = await fetch(`/api/users/${selected.id}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data?.error?.message ?? 'Не удалось обновить роль');
      return;
    }

    toast.success('Роль обновлена');
    setSelected(null);
    await load();
  };

  const createUser = async () => {
    setCreating(true);
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm)
    });
    const data = await response.json().catch(() => ({}));
    setCreating(false);
    if (!response.ok) {
      toast.error(data?.error?.message ?? 'Не удалось создать пользователя');
      return;
    }
    toast.success('Пользователь создан');
    setCreateForm({ fullName: '', email: '', password: '', department: '', role: 'USER' });
    await load();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по имени или почте" />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Создать пользователя</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый пользователь</DialogTitle>
              <DialogDescription>Создание аккаунта с выбранной ролью</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                value={createForm.fullName}
                onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="ФИО"
              />
              <Input
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                type="email"
              />
              <Input
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Пароль"
                type="password"
              />
              <Input
                value={createForm.department}
                onChange={(e) => setCreateForm((p) => ({ ...p, department: e.target.value }))}
                placeholder="Отдел"
              />
              <select
                className="h-10 w-full rounded-md border px-3"
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value as User['role'] }))}
              >
                <option value="USER">USER</option>
                <option value="APPROVER">APPROVER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button onClick={createUser} disabled={creating} className="w-full">
                {creating ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ФИО</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Отдел</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>Загрузка...</TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Нет данных</TableCell>
            </TableRow>
          ) : (
            filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelected(user);
                          setNextRole(user.role);
                        }}
                      >
                        Изменить роль
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Изменение роли</DialogTitle>
                        <DialogDescription>{selected?.email}</DialogDescription>
                      </DialogHeader>
                      <select
                        className="h-10 rounded-md border px-3"
                        value={nextRole}
                        onChange={(e) => setNextRole(e.target.value as User['role'])}
                      >
                        <option value="USER">USER</option>
                        <option value="APPROVER">APPROVER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <Button onClick={applyRole}>Подтвердить</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
