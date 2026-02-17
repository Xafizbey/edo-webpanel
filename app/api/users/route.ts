import { forwardWithToken } from '@/lib/route-helpers';

export async function GET() {
  return forwardWithToken('/users', { method: 'GET' });
}

export async function POST(request: Request) {
  const body = await request.text();
  return forwardWithToken('/users', {
    method: 'POST',
    body
  });
}
