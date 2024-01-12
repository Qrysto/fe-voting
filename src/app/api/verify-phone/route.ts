import { type NextRequest } from 'next/server';
import verifyService from '../verifyService';
import { isValidPhoneNumber, toE164US } from '../phone';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  if (!phoneNumber) {
    return Response.json({ message: 'Missing phone number' }, { status: 400 });
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    return Response.json({ message: 'Invalid phone number' }, { status: 400 });
  }

  const verification = await verifyService.verifications.create({
    to: toE164US(phoneNumber),
    channel: 'sms',
  });
  console.log('verify phone', phoneNumber);
  console.log(verification);
  if (verification.status === 'pending') {
    // TODO: handle other statuses
    return Response.json({ ok: true, verification });
  }
}
