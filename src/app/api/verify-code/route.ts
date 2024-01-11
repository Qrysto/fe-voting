import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import verifyService from '../verifyService';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phoneNumber = body?.phoneNumber;
  const code = body?.code;
  if (!phoneNumber) {
    return Response.json(
      { error: { message: 'Missing phone number' } },
      { status: 400 }
    );
  }
  if (!code) {
    return Response.json(
      { message: 'Missing verification code' },
      { status: 400 }
    );
  }

  const verification = await verifyService.verificationChecks.create({
    to: phoneNumber,
    code,
  });
  if (verification.status === 'approved') {
    jwt.sign(
      { sid: verification.sid, phoneNumber, code, timestamp: Date.now() },
      jwtSecret
    );
    return Response.json({ ok: true });
  } else {
    return Response.json(
      { error: { message: 'Invalid code!' } },
      { status: 400 }
    );
  }
}
