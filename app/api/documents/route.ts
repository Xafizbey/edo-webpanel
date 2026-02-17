import { forwardWithToken } from '@/lib/route-helpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return forwardWithToken(`/documents?${searchParams.toString()}`, { method: 'GET' });
}
