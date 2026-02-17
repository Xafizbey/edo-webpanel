import { forwardWithToken } from '@/lib/route-helpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '20';
  return forwardWithToken(`/audit?limit=${encodeURIComponent(limit)}`, { method: 'GET' });
}
