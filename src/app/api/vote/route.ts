import jwt from 'jsonwebtoken';
import axios from 'axios';
import { type NextRequest } from 'next/server';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body?.token;
  const addresses = [
    body?.c1,
    body?.c2,
    body?.c3,
    body?.c4,
    body?.c5,
    body?.c6,
  ];

  if (!token) {
    return Response.json(
      { message: 'You need to verify your phone number' },
      { status: 401 }
    );
  }
  if (!addresses.every((a) => a)) {
    return Response.json({ message: 'Missing some votes' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 400 }
    );
  }

  try {
    await axios.post(
      'http://node5.nexus.io:7080/finance/debit/token',
      {
        from: '8D6e96n4LTbSASuU7M1dZVJPpEyDFwSETVh8VGYR7WQVCVLJnBj',
        recipients: addresses.map((address, i) => ({
          to: address,
          amount: 6 - i,
        })),
      },
      {
        headers: {
          Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        },
      }
    );
    return Response.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }
}
