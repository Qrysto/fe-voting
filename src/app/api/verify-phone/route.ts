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
    let lookupResult: any = await getLookup(fullPhoneNumber);
    if (!lookupResult) {
      lookupResult = await lookup
        .phoneNumbers(fullPhoneNumber)
        .fetch({ fields: 'line_type_intelligence' });
      await saveLookup(fullPhoneNumber, lookupResult);
      console.log('Lookup result', lookupResult);
    } else {
      console.log('Lookup result (cached)', lookupResult);
    }

    const type = lookupResult?.lineTypeIntelligence?.type;
    if (type !== 'mobile' && type !== 'personal') {
      return Response.json(
        { message: phoneTypeError(type), phoneNumber },
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

function phoneTypeError(type: string | null) {
  if (!type || type === 'unknown') {
    return 'Number Not Usable for US Verification';
  } else {
    return `${displayType(type)} numbers are not allowed!`;
  }
}

function displayType(type: string) {
  switch (type) {
    case 'fixedVoip':
    case 'nonFixedVoip':
      return 'VoIP';
    case 'tollFree':
      return 'Toll-Free';
    case 'uan':
      return 'Universal Access Number';
    case 'sharedCost':
      return 'Shared-Cost';
    default:
      return type.toUpperCase();
  }
}
