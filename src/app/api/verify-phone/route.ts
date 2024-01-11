import { type NextRequest } from 'next/server';
import verifyService from '../verifyService';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  if (!phoneNumber) {
    return Response.json({ message: 'Missing phone number' }, { status: 400 });
  }

  const verification = await verifyService.verifications.create({
    to: phoneNumber,
    channel: 'sms',
  });
  if (verification.status === 'pending') {
    // TODO: handle other statuses
    return Response.json({ ok: true });
  }
}
