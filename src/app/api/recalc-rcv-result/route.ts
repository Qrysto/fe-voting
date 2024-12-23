import { type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import {
  maxChoices,
  ticker,
  allVotesKVKey,
  txCountKVKey,
  rcvResultKVKey,
  endTime,
} from '@/constants/activePoll';
import type { Candidate, RCVResult, Round } from '@/types';
import { callNexus } from '@/constants/activePoll';

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

  // 1. Fetch cached votes from KV
  let [votes, txCount] = await Promise.all([
    kv.lrange<Vote>(allVotesKVKey, 0, -1),
    kv.get<number>(txCountKVKey),
  ]);
  txCount = txCount || 0;
  if (votes) {
    console.log(
      `[RCV] Fetched ${votes.length} votes from KV cache, txCount=${txCount}`
    );
    distributeVotes(votes, voteDistribution);
  } else {
    console.log(`[RCV] No votes found in KV cache! txCount=${txCount}`);
  }

  // 2. Fetch newer votes from Nexus blockchain
  let transactions: any = null;
  let timeTaken: number = 0;
  // const newVotesByRef: { [reference: string]: Vote } = {};
  let newVotes: Vote[] = [];
  do {
    if (timeTaken > 1000) {
      await sleep(5000);
    }
    const fetchStart = Date.now();

    // Fetch transactions
    try {
      transactions = await callNexus(
        `profiles/transactions/master/txid,contracts.reference,contracts.amount,contracts.to.address`,
        {
          where: `results.contracts.ticker=${ticker} AND results.contracts.OP=DEBIT`,
          verbose: 'summary',
          limit,
          offset: txCount,
          sort: 'timestamp',
          order: 'asc',
        }
      );
      timeTaken = Date.now() - fetchStart;
      console.log(
        `[RCV] Fetched transactions from offset ${txCount}. Got ${
          transactions.length
        } transactions, took ${timeTaken / 1000}s`
      );
    } catch (err) {
      console.error('Error fetching from offset', txCount, err);
      throw err;
    }

    // Extract votes from transactions
    for (const tx of transactions) {
      const newVotesByRef: { [reference: string]: Vote } = {};
      for (const contract of tx.contracts) {
        const {
          reference,
          amount,
          to: { address },
        } = contract;
        const index = maxChoices - amount;
        if (index < 0) {
          console.error(
            `[RCV] Abnormal amount ${amount} in transaction txid=${tx.txid} `
          );
          throw new Error('Invalid data!');
        }
        if (!newVotesByRef[reference]) {
          newVotesByRef[reference] = [];
        }
        if (newVotesByRef[reference][index]) {
          console.error(
            `[RCV] Already had the same choice for the same number, reference=${reference} index=${index}`
          );
          // throw new Error('Invalid data!');
        }
        newVotesByRef[reference][index] = address;
      }
      newVotes = [...newVotes, ...Object.values(newVotesByRef)];
    }
    txCount += transactions.length;
  } while (transactions.length === limit);

  // Distribute new votes into the right buckets
  distributeVotes(newVotes, voteDistribution);

  // Save new votes into KV
  if (newVotes.length > 0) {
    await Promise.all([
      kv.lpush(allVotesKVKey, ...newVotes),
      kv.set(txCountKVKey, txCount),
    ]);
  }

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
export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('[RCV] Start Recalculation');
  const startTime = Date.now();

  const candidates: Candidate[] = await callNexus('assets/list/accounts', {
    where: `results.ticker=${ticker} AND results.active=1`,
  });
  console.log('[RCV] Finished fetching Candidate assets', candidates);

  const voteDistribution = await fetchVotesDistribution(candidates);
  console.log('[RCV] Finished fetching votes');

  const result: RCVResult = {
    roundNo: 0,
    rounds: {},
    timeStamp: Date.now(),
    final: Date.now() > endTime,
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

  await kv.set(rcvResultKVKey, result);
  console.log('[RCV] Saved result to KV', rcvResultKVKey);

  return Response.json({ ok: true, result });
}

/**
 * ===========================================================
 */

type Vote = (string | null)[];

interface VoteDistribution {
  [address: string]: Vote[];
}
