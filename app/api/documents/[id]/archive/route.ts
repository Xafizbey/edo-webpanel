import { forwardWithToken } from '@/lib/route-helpers';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  return forwardWithToken(`/documents/${params.id}/archive`, { method: 'POST' });
}
