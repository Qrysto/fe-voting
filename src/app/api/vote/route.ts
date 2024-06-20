import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { maxChoices, tokenAddress, endTime } from '@/constants';
import type { Candidate } from '@/types';
import { markNumberVoted, markNumberNotVoted } from '../phone';

const jwtSecret = process.env.JWT_SECRET || 'secret';

async function fetchCandidateAddresses() {
  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1`
    )}`,
    {
      next: { revalidate: 60, tags: ['allCandidates'] },
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

  const { result }: { result: Candidate[] } = await res.json();
  return result.map((candidate) => candidate.address);
}

export async function POST(request: NextRequest) {
  const pollEnded = Date.now() > endTime;
  if (pollEnded) {
    return Response.json({ message: 'The poll has ended' }, { status: 400 });
  }

  const body = await request.json();
  const jwToken: string = body?.jwToken;
  const votes: string[] = body?.votes;
  if (!jwToken) {
    return Response.json(
      { message: 'You need to verify your phone number' },
      { status: 401 }
    );
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
    const alreadyVoted = !(await markNumberVoted(
      phoneNumber,
      JSON.stringify(votes)
    ));
    if (alreadyVoted) {
      return Response.json(
        { message: 'This phone number has already voted', phoneNumber },
        { status: 400 }
      );
    }

    const emptyVotes = !votes?.length;
    const validAddresses = await fetchCandidateAddresses();
    const allVotesAreValid = votes.every((vote) =>
      validAddresses.includes(vote)
    );
    if (emptyVotes || !allVotesAreValid) {
      return Response.json({ message: 'Invalid vote', votes }, { status: 400 });
    }
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }

  try {
    const body = JSON.stringify({
      from: tokenAddress,
      recipients: votes.map((address, i) => ({
        to: address,
        amount: maxChoices - i,
        reference: `checksum(\`${phoneNumber}\`);`,
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

    if (result?.error) {
      // Revert when the vote fails
      await markNumberNotVoted(phoneNumber);
      return Response.json(
        { message: result.error.message, result },
        { status: 500 }
      );
    } else {
      console.log('Debit result', result.result);
    }
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }
}
