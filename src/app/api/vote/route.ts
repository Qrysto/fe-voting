import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const jwToken: string = body?.jwToken;
  const votes: string[] = body?.votes;
  if (!jwToken) {
    return Response.json(
      { message: 'You need to verify your phone number' },
      { status: 401 }
    );
  }
  if (!votes?.every((a) => a)) {
    return Response.json({ message: 'Missing some votes' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(jwToken, jwtSecret);
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      'http://node5.nexus.io:7080/finance/debit/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: '8D6e96n4LTbSASuU7M1dZVJPpEyDFwSETVh8VGYR7WQVCVLJnBj',
          recipients: votes.map((candidateAddress, i) => ({
            to: candidateAddress,
            amount: 6 - i,
          })),
          pin: process.env.SIGCHAIN_PIN,
        }),
      }
    );
    const result = await response.json();
    if (result.error) {
      return Response.json(
        { message: result.error.message, result },
        { status: 500 }
      );
    } else {
      console.log('Debit result', result);
      return Response.json({ ok: true });
    }
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }
}
