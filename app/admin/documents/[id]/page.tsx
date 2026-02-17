import { notFound } from 'next/navigation';
import { ArchiveButton } from '@/components/layout/archive-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { backendFetch, parseJsonOrThrow } from '@/lib/server-proxy';

interface PageProps {
  params: { id: string };
}

interface DetailResponse {
  id: string;
  title: string;
  status: string;
  type: string;
  bodyJson: Record<string, unknown>;
  createdAt: string;
  author?: { fullName: string; email: string; department: string };
}

interface TimelineResponse {
  approvalSteps: Array<{
    id: string;
    order: number;
    decisionStatus: string;
    approver?: { fullName: string; email: string };
    comment?: string | null;
  }>;
  auditLogs: Array<{
    id: string;
    createdAt: string;
    actionType: string;
    actor?: { fullName: string; role: string };
    metaJson?: unknown;
  }>;
}

export default async function AdminDocumentDetailPage({ params }: PageProps) {
  const [docResp, timelineResp] = await Promise.all([
    backendFetch(`/documents/${params.id}`),
    backendFetch(`/documents/${params.id}/timeline`)
  ]);

  if (!docResp.ok) notFound();

  const doc = await parseJsonOrThrow<DetailResponse>(docResp);
  const timeline = await parseJsonOrThrow<TimelineResponse>(timelineResp);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{doc.title}</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">
              {doc.type} • {doc.author?.fullName} • {new Date(doc.createdAt).toLocaleString('ru-RU')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{doc.status}</Badge>
            {(doc.status === 'APPROVED' || doc.status === 'REJECTED') && <ArchiveButton documentId={doc.id} />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/20 p-3">
            <div className="mb-2 text-sm font-semibold">Поля документа</div>
            <pre className="overflow-x-auto text-xs">{JSON.stringify(doc.bodyJson, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Шаги согласования</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Шаг</TableHead>
                <TableHead>Согласующий</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Комментарий</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeline.approvalSteps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell>{step.order}</TableCell>
                  <TableCell>{step.approver?.fullName ?? '-'}</TableCell>
                  <TableCell>{step.decisionStatus}</TableCell>
                  <TableCell>{step.comment ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Кто</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeline.auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.createdAt).toLocaleString('ru-RU')}</TableCell>
                  <TableCell>{log.actionType}</TableCell>
                  <TableCell>{log.actor?.fullName ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
