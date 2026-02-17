import { forwardWithToken } from '@/lib/route-helpers';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.text();
  return forwardWithToken(`/users/${params.id}/role`, {
    method: 'PATCH',
    body
  });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.text();
  return forwardWithToken(`/users/${params.id}/role`, {
    method: 'PATCH',
    body
  });
}
