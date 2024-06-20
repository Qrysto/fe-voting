import { type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import {
  maxChoices,
  tokenAddress,
  rcvResultKVKey,
  votesPageKVKey,
  phoneNumbersTable,
} from '@/constants';
import type { Choice, Candidate, RCVResult, Round } from '@/types';

export const maxDuration = 300;

const limit = 100;

function sleep(miliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(undefined), miliseconds)
  );
}

/**
 * ===========================================================
 */
async function fetchCandidates() {
  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1`
    )}`,
    {
      cache: 'no-store',
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
  return result as Candidate[];
}

/**
 * ===========================================================
 */
async function fetchPage(page: number) {
  const res = await fetch(
    `http://node5.nexus.io:7080/profiles/transactions/master`,
    {
      cache: 'no-store',
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: `results.contracts.token=${tokenAddress} AND results.contracts.OP=DEBIT`,
        verbose: 'summary',
        limit,
        page,
        sort: 'timestamp',
        order: 'asc',
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    console.error('profiles/transactions/master', res.status, err);
    throw err;
  }
  const json = await res.json();
  return json.result;
}

/**
 * ===========================================================
 */
async function fetchVotesPage(page: number) {
  const body = JSON.stringify({
    table: phoneNumbersTable,
    limit,
    page,
  });
  const res = await fetch('http://node5.nexus.io:7080/local/list/record', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    const err = await res.json();
    console.error(
      'Error fetching votes from records, page',
      page,
      'error',
      err
    );
    throw err;
  }
  const json = await res.json();
  const voteList = Object.values(json?.result).map((stringified) =>
    JSON.parse(stringified as string)
  );
  return voteList as Vote[];
}

/**
 * ===========================================================
 */
function distributeVotes(votes: Vote[], voteDistribution: VoteDistribution) {
  votes.forEach((vote) => {
    const firstChoice = vote[0];
    if (firstChoice) {
      if (voteDistribution[firstChoice]) {
        voteDistribution[firstChoice]?.push(vote);
      } else {
        console.log('!votes[firstChoice]', firstChoice, voteDistribution);
      }
    }
  });
}

/**
 * ===========================================================
 */
async function fetchVotesDistribution(candidates: Candidate[]) {
  let voteDistribution: VoteDistribution = {};
  // Initialize votes arrays for all candidates
  candidates.forEach(({ address }) => {
    voteDistribution[address] = [];
  });

  // Fetch votes from records
  let page = 0;
  let votes: Vote[] | null = null;
  do {
    votes = await fetchVotesPage(page);

    console.log(
      `[RCV] Fetched votes page ${page} from records. Got ${votes.length} votes`
    );

    // Distribute votes into the right buckets
    distributeVotes(votes, voteDistribution);
    page++;
  } while (votes?.length === limit);

  return voteDistribution;
}

/**
 * ===========================================================
 */
function processRCVRound({
  result,
  voteDistribution,
  eliminatedAddresses,
}: {
  result: RCVResult;
  voteDistribution: VoteDistribution;
  eliminatedAddresses: string[];
}) {
  const round: Round = (result.rounds[result.roundNo] = {
    voteCount: {},
  });
  // Addresses of candidates that are still not eliminated
  const addresses = Object.keys(voteDistribution);

  // 1. Count the votes
  addresses.forEach((address) => {
    round.voteCount[address] = voteDistribution[address].length;
  });

  // 2. Check for winner
  const total = addresses.reduce(
    (sum, address) => sum + round.voteCount[address],
    0
  );
  const winner = addresses.find(
    (address) => round.voteCount[address] > total * 0.5
  );
  if (winner) {
    round.winner = winner;
    return true;
  }

  // 3. No winner yet => Eliminate the candidate who has the lowest vote count
  // Look for the lowest vote count
  const eliminated = addresses.reduce(
    (lowest: string | undefined, address) =>
      lowest === undefined || round.voteCount[address] < round.voteCount[lowest]
        ? address
        : lowest,
    undefined
  );
  if (eliminated) {
    round.eliminated = eliminated;
    eliminatedAddresses.push(eliminated);

    // Move votes from the elinimated candidate to the next preferred one
    voteDistribution[eliminated].forEach((vote) => {
      for (let i = 0; i < vote.length; i++) {
        const voteAddress = vote[i];
        if (voteAddress === eliminated) {
          vote[i] = null;
        } else if (voteAddress && !eliminatedAddresses.includes(voteAddress)) {
          // Debugging
          if (voteAddress === undefined) {
            console.log('undefined in vote', vote, i);
          }
          if (!voteDistribution[voteAddress]) {
            console.log('!votes[voteAddress]', voteAddress, voteDistribution);
          }
          // Found the highest preferred candidate who is not eliminated -> move it
          voteDistribution[voteAddress].push(vote);
          break;
        }
      }
    });

    // Remove eliminated candidate from votes
    delete voteDistribution[eliminated];
  }

  return false;
}

/**
 * ===========================================================
 */
async function saveRCVResult(result: RCVResult) {
  await kv.set(rcvResultKVKey, result);
  console.log('[RCV] Saved result to KV', rcvResultKVKey);
}

/**
 * ===========================================================
 */
export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('[RCV] Start Recalculation');
  const startTime = Date.now();

  const candidates = await fetchCandidates();
  console.log('[RCV] Finished fetching Choice assets', candidates);

  const voteDistribution = await fetchVotesDistribution(candidates);
  console.log('[RCV] Finished fetching votes');

  const result: RCVResult = {
    roundNo: 0,
    rounds: {},
    timeStamp: Date.now(),
  };
  const eliminatedAddresses: string[] = [];

  let foundWinner = false;
  do {
    result.roundNo++;
    foundWinner = processRCVRound({
      result,
      voteDistribution,
      eliminatedAddresses,
    });
    console.log('[RCV] Round ', result.roundNo, result.rounds[result.roundNo]);
  } while (!foundWinner && result.roundNo <= maxChoices);

  const duration = Date.now() - startTime;
  console.log(`[RCV] Finished Recalculation (${duration / 1000}s)`);
  console.log('[RCV] Result: ', result);

  await saveRCVResult(result);
  return Response.json({ ok: true, result });
}

/**
 * ===========================================================
 */

type Vote = (string | null)[];

interface VoteDistribution {
  [address: string]: Vote[];
}
