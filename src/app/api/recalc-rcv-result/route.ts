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

function sleep(miliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(undefined), miliseconds)
  );
}

/**
 * ===========================================================
 * @returns
 */
async function fetchChoices() {
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
  return result as Choice[];
}

/**
 * ===========================================================
 * @param page
 * @param limit
 * @returns
 */
async function fetchPage(page: number, limit: number) {
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
async function fetchVotesPage(page: number, limit: number) {
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
 * @param voteList
 * @param votes
 */
function distributeVotes(voteList: Vote[], votes: VoteDistribution) {
  voteList.forEach((vote) => {
    const firstChoice = vote[0];
    if (firstChoice) {
      if (votes[firstChoice]) {
        votes[firstChoice]?.push(vote);
      } else {
        console.log('!votes[firstChoice]', firstChoice, votes);
      }
    }
  });
}

/**
 * ===========================================================
 * @param choices
 * @returns
 */
async function fetchVotesDistribution(choices: Choice[]) {
  // Prepare addressMap
  let votes: VoteDistribution = {};
  const addressMap: AddressMap = {};
  choices.forEach(({ choice, address, reference }) => {
    if (choice === 1) {
      addressMap[address] = {
        address,
        choice,
      };
      // Populate all votes arrays for all candidates
      votes[address] = [];
    } else {
      addressMap[address] = {
        address: reference,
        choice,
      };
    }
  });

  // Fetch votes from records
  const limit = 100;
  let page = 0;
  let voteList: Vote[] | null = null;
  do {
    voteList = await fetchVotesPage(page, limit);

    console.log(
      `[RCV] Fetched votes page ${page} from records. Got ${voteList.length} votes`
    );

    // Distribute votes into the right buckets
    distributeVotes(voteList, votes);
    page++;
  } while (voteList?.length === limit);

  return votes;
}

/**
 * ===========================================================
 * @param param0
 * @returns
 */
function processRCVRound({
  result,
  votes,
  eliminatedAddresses,
}: {
  result: RCVResult;
  votes: VoteDistribution;
  eliminatedAddresses: string[];
}) {
  const round: Round = (result.rounds[result.roundNo] = {
    voteCount: {},
  });
  // Addresses of candidates that are still not eliminated
  const addresses = Object.keys(votes);

  // 1. Count the votes
  addresses.forEach((address) => {
    round.voteCount[address] = votes[address].length;
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

  // 3. No winner yet => Eliminate candidate has the lowest vote count
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

    // Move votes from elinimated to the next preferred candidate
    votes[eliminated].forEach((vote) => {
      for (let i = 0; i < vote.length; i++) {
        const voteAddress = vote[i];
        if (voteAddress === eliminated) {
          vote[i] = null;
        } else if (voteAddress && !eliminatedAddresses.includes(voteAddress)) {
          // Debugging
          if (voteAddress === undefined) {
            console.log('undefined in vote', vote, i);
          }
          if (!votes[voteAddress]) {
            console.log('!votes[voteAddress]', voteAddress, votes);
          }
          // Found the highest preferred candidate who is not eliminated -> move it
          votes[voteAddress]?.push(vote);
          break;
        }
      }
    });

    // Remove eliminated candidate from votes
    delete votes[eliminated];
  }

  return false;
}

/**
 * ===========================================================
 * @param result
 */
async function saveRCVResult(result: RCVResult) {
  await kv.set(rcvResultKVKey, result);
  console.log('[RCV] Saved result to KV', rcvResultKVKey);
}

/**
 * ===========================================================
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('[RCV] Start Recalculation');
  const startTime = Date.now();

  const choices = await fetchChoices();
  console.log('[RCV] Finished fetching Choice assets', choices);

  const votes = await fetchVotesDistribution(choices);
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
    foundWinner = processRCVRound({ result, votes, eliminatedAddresses });
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

interface AddressMap {
  [address: string]: { address: string; choice: number };
}

type Vote = (string | null)[];

interface VoteDistribution {
  [address: string]: Vote[];
}
