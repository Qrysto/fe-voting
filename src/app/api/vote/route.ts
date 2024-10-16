import jwt from 'jsonwebtoken';
import { type NextRequest } from 'next/server';
import { maxChoices, ticker, endTime } from '@/constants/activePoll';
import type { Candidate } from '@/types';
import { callNexus } from '@/constants/activePoll';
import allPolls from '@/constants/allPolls';
import { markNumberVoted, markNumberNotVoted } from '@/lib/phone';

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
  const jwtToken: string | undefined = body?.jwtToken;
  const phoneNumber: string = body?.phoneNumber || '';
  const votes: string[] | undefined = body?.votes;
  const optedIn: boolean | undefined = body?.optedIn;
  if (!jwtToken) {
    return Response.json(
      { message: 'You need to verify your phone number' },
      { status: 401 }
    );
  }
  if (!votes) {
    return Response.json({ message: 'Votes are missing' }, { status: 400 });
  }
  if (votes?.length > maxChoices) {
    return Response.json(
      { message: 'You voted for too many candidates' },
      { status: 400 }
    );
  }

  // let phoneNumber: string;
  // try {
  //   const decoded: any = jwt.verify(jwtToken, jwtSecret);
  //   phoneNumber = decoded.phoneNumber;
  // } catch (err: any) {
  //   return Response.json(
  //     { message: err?.message, error: err },
  //     { status: 401 }
  //   );
  // }

  try {
    const alreadyVoted = !(await markNumberVoted(phoneNumber, {
      votes,
      optedIn: !!optedIn,
    }));
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pollId = searchParams.get('poll');
  const poll = pollId && allPolls[pollId];
  if (!poll) {
    return Response.json({ message: 'Invalid poll ID' }, { status: 400 });
  }
  const { callNexus, tokenAddress, countryCode, maxChoices } = poll;

  const phone = searchParams.get('phone');
  if (!phone) {
    return Response.json({ message: 'Invalid phone number' }, { status: 400 });
  }
  const phoneNumber =
    countryCode === false && phone.startsWith('+1')
      ? phone.substring(2)
      : phone;

  try {
    const txs = await callNexus(
      'finance/transactions/token/txid,contracts.reference,contracts.amount,contracts.to.address',
      {
        address: tokenAddress,
        limit: 1,
        where: `results.contracts.OP=DEBIT AND results.contracts.reference=checksum(\`${phoneNumber}\`);`,
      }
    );

    const transaction = txs[0];
    const choices = await Promise.all(
      transaction.contracts
        .sort((a: any, b: any) => b.amount - a.amount)
        .map((contract: any) =>
          callNexus('finance/get/account/address,First,Last,Party,Website', {
            address: contract.to.address,
          })
        )
    );
    const vote = { txid: transaction.txid, choices };
    return Response.json({ vote });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { message: err?.message, error: err },
      { status: 500 }
    );
  }
}
