import { forwardWithToken } from '@/lib/route-helpers';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return forwardWithToken(`/documents/${params.id}`, { method: 'GET' });
}
