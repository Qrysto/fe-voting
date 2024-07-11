import { kv } from '@vercel/kv';
import { rcvResultKVKey } from '@/constants/poll3Staging';

export async function GET() {
  const result = await kv.get(rcvResultKVKey);

  return Response.json({ result });
}
