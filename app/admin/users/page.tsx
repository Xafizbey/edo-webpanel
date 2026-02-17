import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersAdminTable } from '@/components/layout/users-admin-table';

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Пользователи</CardTitle>
      </CardHeader>
      <CardContent>
        <UsersAdminTable />
      </CardContent>
    </Card>
  );
}
