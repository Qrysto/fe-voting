import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { isVoted, addVoted } from '../phone';

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
  if (!votes?.length || !votes?.every((a) => a)) {
    return Response.json({ message: 'Missing some votes' }, { status: 400 });
  }
  if (votes?.length > 6) {
    return Response.json(
      { message: 'Voted for too many candidates' },
      { status: 400 }
    );
  }

  let phoneNumber;
  try {
    const decoded: any = jwt.verify(jwToken, jwtSecret);
    phoneNumber = decoded.phoneNumber;
    if (await isVoted(phoneNumber)) {
      return Response.json(
        { message: 'This phone number has already voted' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }

  try {
    const body = JSON.stringify({
      from: 'votes',
      recipients: votes.map((candidateAddress, i) => ({
        to: candidateAddress,
        amount: 6 - i,
      })),
      pin: process.env.SIGCHAIN_PIN,
    });
    const response = await fetch(
      'http://node5.nexus.io:7080/finance/debit/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
          'Content-Type': 'application/json',
        },
        body,
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
      console.log('Body', phoneNumber, body);
      try {
        await addVoted(phoneNumber);
        return Response.json({ ok: true });
      } catch (err) {
        return Response.json(
          { message: 'This phone number has already voted', error: err },
          { status: 400 }
        );
      }
    }
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }
}
