import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { maxChoices, tokenAddress } from '@/constants';
import type { Choice } from '@/types';
import { isVoted, addVoted } from '../phone';

const jwtSecret = process.env.JWT_SECRET || 'secret';

async function fetchChoiceMap() {
  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1`
    )}`,
    {
      next: { revalidate: 60, tags: ['allChoices'] },
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      },
    }
  );
  if (!res.ok) {
    const err = await res.json();
    console.error('assets/list/accounts', res.status, err);
    throw err;
  }

  const { result } = await res.json();
  const data: {
    [candidateAddress: string]: {
      [choice: number]: string;
    };
  } = {};
  result.forEach(({ choice, reference, address }: Choice) => {
    if (choice > 1) {
      if (!data[reference]) {
        data[reference] = {};
      }
      data[reference][choice] = address;
    }
  });
  return data;
}

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
  if (votes?.length > maxChoices) {
    return Response.json(
      { message: 'You voted for too many candidates' },
      { status: 400 }
    );
  }

  let phoneNumber;
  try {
    const decoded: any = jwt.verify(jwToken, jwtSecret);
    phoneNumber = decoded.phoneNumber;
    if (await isVoted(phoneNumber)) {
      return Response.json(
        { message: 'This phone number has already voted', phoneNumber },
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
    // Ranked Choice Voting applied
    const choices = await fetchChoiceMap();
    const destAddresses: string[] = [];
    votes.forEach((candidateAddress, i) => {
      if (i === 0) {
        // First choice - send to candidate address (choice 1)
        destAddresses[0] = candidateAddress;
      } else {
        // Other choices - find the address corresponding to the candidate
        // Choice 2 is at index 1 in the array, and so on...
        destAddresses[i] = choices[candidateAddress][i + 1];
      }
    });

    const body = JSON.stringify({
      from: tokenAddress,
      recipients: destAddresses.map((address) => ({
        to: address,
        amount: 1,
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
