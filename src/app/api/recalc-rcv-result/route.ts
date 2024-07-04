import { type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import {
  maxChoices,
  ticker,
  rcvResultKVKey,
  phoneNumbersTable,
} from '@/constants';
import type { Choice, Candidate, RCVResult, Round } from '@/types';
import { callNexus } from '@/app/lib/api';

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
  const result = await callNexus('assets/list/accounts', {
    where: `results.ticker=${ticker} AND results.active=1`,
  });
  return result as Candidate[];
}

/**
 * ===========================================================
 */
async function fetchPage(page: number) {
  return await callNexus(`profiles/transactions/master`, {
    where: `results.contracts.ticker=${ticker} AND results.contracts.OP=DEBIT`,
    verbose: 'summary',
    limit,
    page,
    sort: 'timestamp',
    order: 'asc',
  });
}

/**
 * ===========================================================
 */
async function fetchVotesPage(page: number) {
  try {
    const result = await callNexus('local/list/record', {
      table: phoneNumbersTable,
      limit,
      page,
    });
    const voteList = Object.values(result).map((stringified) =>
      JSON.parse(stringified as string)
    );
    return voteList as Vote[];
  } catch (err) {
    console.error(
      'Error fetching votes from records, page',
      page,
      'error',
      err
    );
    throw err;
  }
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
 * @returns whether result calculation is finished
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
  let zeroVotes = true;
  addresses.forEach((address) => {
    const voteCount = voteDistribution[address].length;
    round.voteCount[address] = voteCount;
    if (voteCount > 0) {
      zeroVotes = false;
    }
  });

  // Skip other steps if there are zero votes
  if (zeroVotes) {
    return true; // finish result calculation
  }

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
    return true; // found a winner => finish result calculation
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

  let finished = false;
  do {
    result.roundNo++;
    finished = processRCVRound({
      result,
      voteDistribution,
      eliminatedAddresses,
    });
    console.log('[RCV] Round ', result.roundNo, result.rounds[result.roundNo]);
  } while (!finished && result.roundNo <= maxChoices);

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
