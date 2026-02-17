'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ArchiveButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const archive = async () => {
    setLoading(true);
    const response = await fetch(`/api/documents/${documentId}/archive`, { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      toast.error(data?.error?.message ?? 'Не удалось архивировать');
      return;
    }

    toast.success('Документ архивирован');
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Архивировать</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Архивировать документ?</DialogTitle>
          <DialogDescription>
            Действие доступно только для статусов APPROVED/REJECTED. После архивирования статус станет ARCHIVED.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={archive} disabled={loading}>
          {loading ? 'Сохраняем...' : 'Подтвердить'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
