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

  const fullPhoneNumber = toE164US(phoneNumber);
  try {
    const verification = await verifyService.verifications.create({
      to: fullPhoneNumber,
      channel: 'sms',
    });
    console.log('Verify phone', fullPhoneNumber, verification);
  } catch (error: any) {
    return Response.json({ message: error?.message, error }, { status: 400 });
  }
  return Response.json({ ok: true, phoneNumber: fullPhoneNumber });
}
