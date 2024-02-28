import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { verifyService } from '../twilio';
import { isValidPhoneNumber } from '../phone';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  const code = body?.code;
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
  if (!code) {
    return Response.json(
      { message: 'Missing verification code', phoneNumber },
      { status: 400 }
    );
  }

  try {
    const verification = await verifyService.verificationChecks.create({
      to: '+1' + phoneNumber,
      code,
    });
    console.log(
      'Check code',
      code,
      'for phone number',
      phoneNumber,
      verification
    );

    if (verification.status === 'approved') {
      try {
        const token = jwt.sign(
          { sid: verification.sid, phoneNumber, code },
          jwtSecret,
          {
            expiresIn: '1 day',
          }
        );
        return Response.json({ ok: true, token, phoneNumber });
      } catch (err) {
        return Response.json(
          { message: JSON.stringify(err), phoneNumber },
          { status: 500 }
        );
      }
    } else {
      return Response.json(
        { message: 'Invalid code!', code, phoneNumber },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.log('Verify code error', code, 'phone', phoneNumber);
    console.error(err);
    return Response.json(
      { message: err?.message, error: err, phoneNumber },
      { status: 400 }
    );
  }
}
