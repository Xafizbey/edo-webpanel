import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { backendFetch, parseJsonOrThrow } from '@/lib/server-proxy';
import { PagedDocuments } from '@/lib/types';
import { DocumentFiltersSheet } from '@/components/layout/document-filters-sheet';

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AdminDocumentsPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);
  const pageSize = Number(searchParams.pageSize ?? 10);

  const params = new URLSearchParams();
  for (const key of ['status', 'type', 'department', 'q']) {
    const value = searchParams[key];
    if (typeof value === 'string' && value.trim()) {
      params.set(key, value);
    }
  }
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  const response = await backendFetch(`/documents?${params.toString()}`);
  if (!response.ok) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Документы недоступны</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Не удалось получить данные. Проверьте backend и авторизацию администратора.
        </CardContent>
      </Card>
    );
  }
  const data = await parseJsonOrThrow<PagedDocuments>(response);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Документы</CardTitle>
        <DocumentFiltersSheet />
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Департамент</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Link href={`/admin/documents/${doc.id}`} className="font-medium text-primary underline-offset-2 hover:underline">
                    {doc.id.slice(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.author?.department ?? '-'}</TableCell>
                <TableCell>
                  <Badge variant={badgeVariant(doc.status)}>{doc.status}</Badge>
                </TableCell>
                <TableCell>{doc.author?.fullName ?? '-'}</TableCell>
                <TableCell>{new Date(doc.createdAt).toLocaleDateString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Страница {data.meta.page} из {data.meta.totalPages}. Всего: {data.meta.total}
          </div>
          <div className="flex gap-2">
            <PaginationButton searchParams={searchParams} disabled={data.meta.page <= 1} page={data.meta.page - 1}>
              Назад
            </PaginationButton>
            <PaginationButton
              searchParams={searchParams}
              disabled={data.meta.page >= data.meta.totalPages}
              page={data.meta.page + 1}
            >
              Вперёд
            </PaginationButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaginationButton({
  page,
  searchParams,
  disabled,
  children
}: {
  page: number;
  searchParams: Record<string, string | string[] | undefined>;
  disabled: boolean;
  children: ReactNode;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (typeof v === 'string' && v.trim()) {
      params.set(k, v);
    }
  });
  params.set('page', String(page));

  return (
    disabled ? (
      <Button disabled variant="outline">
        {children}
      </Button>
    ) : (
      <Button asChild variant="outline">
        <Link href={`/admin/documents?${params.toString()}`}>{children}</Link>
      </Button>
    )
  );
}

function badgeVariant(status: string): 'secondary' | 'destructive' | 'default' | 'muted' {
  if (status === 'APPROVED') return 'secondary';
  if (status === 'REJECTED') return 'destructive';
  if (status === 'IN_REVIEW') return 'default';
  return 'muted';
}
