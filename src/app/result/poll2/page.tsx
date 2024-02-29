import type { Metadata } from 'next';
import { kv } from '@vercel/kv';
import { Candidate, RCVResult } from '@/types';
import { tokenAddress, rcvTable, rcvKey } from '@/constants';
import Round from './Round';
import UpdatedTime from './UpdatedTime';

export const metadata: Metadata = {
  title: 'Results | Free And Equal',
  description: 'View the results of the current vote! Powered by nexus.io.',
  openGraph: {
    title: 'Results | Free And Equal',
    description: 'View the results of the current vote! Powered by nexus.io.',
    url: 'https://vote.freeandequal.org/result/poll2',
    type: 'website',
    siteName: 'Free And Equal Voting App',
  },
};

async function loadRCVCandidates() {
  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1 AND results.choice=1`
    )}`,
    {
      next: { revalidate: 60, tags: ['allChoices'] },
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      },
    }
  );
  if (!res.ok) {
    console.error('assets/list/accounts', res.status, res.body);
    const err = await res.json();
    throw err;
  }

  const result = await res.json();
  const candidates: Candidate[] = result?.result;
  return candidates;
}

async function loadRCVResult() {
  const result = await kv.get(rcvTable);
  // const res = await fetch(
  //   `http://node5.nexus.io:7080/local/list/records?table=${rcvTable}`,
  //   {
  //     cache: 'no-store',
  //     headers: {
  //       Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // );
  // if (!res.ok) {
  //   const err = await res.json();
  //   console.error('Failed to get RCV result', res.status, err);
  //   throw err;
  // }

  // const json = await res.json();
  // const resultJson = json?.result?.[rcvKey];
  // const result = (resultJson && JSON.parse(resultJson)) || null;
  return result as RCVResult | null;
}

export default async function RankingPage() {
  const [candidates, result] = await Promise.all([
    loadRCVCandidates(),
    loadRCVResult(),
  ]);

  return (
    <div className="mt-4">
      <h2 className="text-3xl uppercase text-darkBlue">Ranking</h2>
      {result ? (
        <>
          <UpdatedTime timeStamp={result.timeStamp} />
          <div className="mt-10">
            {Object.keys(result.rounds).map((roundNo) => (
              <Round
                key={roundNo}
                roundNo={parseInt(roundNo)}
                round={result.rounds[parseInt(roundNo)]}
                candidates={candidates}
              />
            ))}
          </div>
        </>
      ) : (
        <p>No ranking yet</p>
      )}
    </div>
  );
}
