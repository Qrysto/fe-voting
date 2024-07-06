import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { maxChoices, ticker, endTime } from '@/constants';
import type { Candidate } from '@/types';
import { callNexus } from '@/app/lib/api';
import { markNumberVoted, markNumberNotVoted } from '../phone';

const jwtSecret = process.env.JWT_SECRET || 'secret';

async function fetchCandidateAddresses() {
  const result: Candidate[] = await callNexus(
    'assets/list/accounts',
    { where: `results.ticker=${ticker} AND results.active=1` },
    { revalidate: 60, tags: ['allCandidates'] }
  );
  return result.map((candidate) => candidate.address);
}

export async function POST(request: NextRequest) {
  const pollEnded = Date.now() > endTime;
  if (pollEnded) {
    return Response.json({ message: 'The poll has ended' }, { status: 400 });
  }

  const body = await request.json();
  const jwtToken: string = body?.jwtToken;
  const votes: string[] = body?.votes;
  if (!jwtToken) {
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

  let phoneNumber: string;
  try {
    const decoded: any = jwt.verify(jwtToken, jwtSecret);
    phoneNumber = decoded.phoneNumber;
  } catch (err: any) {
    return Response.json(
      { message: err?.message, error: err },
      { status: 401 }
    );
  }

  try {
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
  } catch (err: any) {
    return Response.json({ message: 'Server error' }, { status: 500 });
  }

  const emptyVotes = !votes?.length;
  const validAddresses = await fetchCandidateAddresses();
  const allVotesAreValid = votes.every((vote) => validAddresses.includes(vote));
  if (emptyVotes || !allVotesAreValid) {
    return Response.json({ message: 'Invalid vote', votes }, { status: 400 });
  }

  try {
    const result = await callNexus('finance/debit/token', {
      from: ticker,
      recipients: votes.map((address, i) => ({
        to: address,
        amount: maxChoices - i,
        reference: `checksum(\`${phoneNumber}\`);`,
      })),
      pin: process.env.SIGCHAIN_PIN,
    });

    console.log('Debit result', result);
  } catch (err: any) {
    console.error(err);
    // Revert when the vote fails
    await markNumberNotVoted(phoneNumber);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
