import { type NextRequest } from 'next/server';
import { verifyService, lookup } from '../twilio';
import {
  isValidPhoneNumber,
  toE164US,
  isVoted,
  getLookup,
  saveLookup,
} from '@/lib/phone';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  if (!phoneNumber) {
    return Response.json(
      { message: 'Missing phone number', phoneNumber },
      { status: 400 }
    );
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    return Response.json(
      { message: 'Invalid phone number', phoneNumber },
      { status: 400 }
    );
  }
  try {
    if (await isVoted(phoneNumber)) {
      return Response.json(
        { message: 'This phone number has already voted', phoneNumber },
        { status: 400 }
      );
    }
  } catch (err) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }

  const fullPhoneNumber = toE164US(phoneNumber);
  try {
    let lookup = await getLookup(fullPhoneNumber);
    if (!lookup) {
      lookup = await lookup
        .phoneNumbers(fullPhoneNumber)
        .fetch({ fields: 'line_type_intelligence' });
      await saveLookup(fullPhoneNumber, lookup);
      console.log('Lookup result', lookup);
    } else {
      console.log('Lookup result (cached)', lookup);
    }

    const type = lookup?.lineTypeIntelligence?.type;
    if (type === 'nonFixedVoip') {
      return Response.json(
        { message: 'VOIP numbers are not allowed', phoneNumber },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { message: 'Unknown error occurred' },
      { status: 500 }
    );
  }

  try {
    const verification = await verifyService.verifications.create({
      to: fullPhoneNumber,
      channel: 'sms',
    });
    console.log('Verify phone result', phoneNumber, verification);
  } catch (error: any) {
    console.error(error);
    return Response.json({ message: error?.message, error }, { status: 400 });
  }
  return Response.json({ ok: true, phoneNumber });
}
