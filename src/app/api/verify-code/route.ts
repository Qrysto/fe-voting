import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import verifyService from '../verifyService';
import { isValidPhoneNumber } from '../phone';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  const code = body?.code;
  if (!phoneNumber) {
    return Response.json({ message: 'Missing phone number' }, { status: 400 });
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    return Response.json({ message: 'Invalid phone number' }, { status: 400 });
  }
  if (!code) {
    return Response.json(
      { message: 'Missing verification code' },
      { status: 400 }
    );
  }

  try {
    const verification = await verifyService.verificationChecks.create({
      to: '+1' + phoneNumber,
      code,
    });
    console.log('verify code', code, 'phone', phoneNumber);
    console.log(verification);

    if (verification.status === 'approved') {
      try {
        const token = jwt.sign(
          { sid: verification.sid, phoneNumber, code },
          jwtSecret,
          {
            expiresIn: '1 day',
          }
        );
        return Response.json({ ok: true, token, verification });
      } catch (err) {
        return Response.json({ message: JSON.stringify(err) }, { status: 500 });
      }
    } else {
      return Response.json({ message: 'Invalid code!' }, { status: 400 });
    }
  } catch (err: any) {
    console.log('verify code error', code, 'phone', phoneNumber);
    console.error(err);
    console.log(JSON.stringify(err, null, 2));
    return Response.json(
      { message: err?.message, error: err },
      { status: 400 }
    );
  }
}
