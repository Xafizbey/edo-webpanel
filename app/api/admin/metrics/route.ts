import { forwardWithToken } from '@/lib/route-helpers';

export async function GET() {
  return forwardWithToken('/admin/metrics', { method: 'GET' });
}
