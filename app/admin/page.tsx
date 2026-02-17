import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { backendFetch, parseJsonOrThrow } from '@/lib/server-proxy';
import { StatusChart } from '@/components/layout/status-chart';

interface MetricsResponse {
  statusCounts: Record<string, number>;
  typeCounts: Record<string, number>;
}

interface AuditItem {
  id: string;
  actionType: string;
  createdAt: string;
  actor: { fullName: string; role: string };
  document: { id: string; title: string };
}

export default async function AdminDashboardPage() {
  const [metricsResp, auditResp] = await Promise.all([backendFetch('/admin/metrics'), backendFetch('/audit?limit=20')]);
  const metrics = await parseJsonOrThrow<MetricsResponse>(metricsResp);
  const audit = await parseJsonOrThrow<AuditItem[]>(auditResp);

  const totalDocs = Object.values(metrics.statusCounts).reduce((acc, n) => acc + n, 0);
  const review = metrics.statusCounts.IN_REVIEW ?? 0;
  const approved = metrics.statusCounts.APPROVED ?? 0;
  const rejected = metrics.statusCounts.REJECTED ?? 0;

  const chartData = Object.entries(metrics.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Всего документов" value={String(totalDocs)} />
        <MetricCard title="На согласовании" value={String(review)} />
        <MetricCard title="Согласовано" value={String(approved)} />
        <MetricCard title="Отклонено" value={String(rejected)} />
      </div>

      <Tabs defaultValue="statuses">
        <TabsList>
          <TabsTrigger value="statuses">Статусы</TabsTrigger>
          <TabsTrigger value="types">Типы документов</TabsTrigger>
        </TabsList>
        <TabsContent value="statuses">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по статусам</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusChart data={chartData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по типам</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {Object.entries(metrics.typeCounts).map(([type, count]) => (
                  <li key={type} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span>{type}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Последние действия</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Исполнитель</TableHead>
                <TableHead>Документ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{new Date(row.createdAt).toLocaleString('ru-RU')}</TableCell>
                  <TableCell>{row.actionType}</TableCell>
                  <TableCell>{row.actor.fullName}</TableCell>
                  <TableCell>{row.document?.title ?? row.document?.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
