import type { Metadata } from 'next';
import { kv } from '@vercel/kv';
import { Candidate, RCVResult } from '@/types';
import { tokenAddress, rcvResultKVKey } from '@/constants';
import Round from './Round';
// import UpdatedTime from './UpdatedTime';
import Winner from './Winner';
import EndingTime from './EndingTime';

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
  const result = await kv.get(rcvResultKVKey);
  return result as RCVResult | null;
}

export default async function RankingPage() {
  const [candidates, result] = await Promise.all([
    loadRCVCandidates(),
    loadRCVResult(),
  ]);

  return (
    <div className="mt-6">
      <h2 className="mt-4 text-xl uppercase">Debate Winner Poll</h2>
      <div className="mb-3">February 29th - March 7th</div>
      {/* <EndingTime /> */}

      <h1 className="mt-4 text-3xl uppercase text-darkBlue">
        Final poll result
      </h1>
      {result ? (
        <>
          {/* <UpdatedTime timeStamp={result.timeStamp} /> */}
          <div className="mt-6">
            <h2 className="text-2xl uppercase text-darkBlue">Winner</h2>
            <Winner candidates={candidates} result={result} />
          </div>

          <div className="mt-10">
            <h2 className="text-2xl uppercase text-darkBlue">Round Results</h2>
            <p className="mt-[10px] text-lg leading-6">
              This poll uses{' '}
              <a
                target="_blank"
                href="https://fairvote.org/our-reforms/ranked-choice-voting/"
                className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
              >
                Ranked Choice Voting
              </a>
              .
            </p>
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
        <p className="mt-4">Results will be calculated in a few minutes.</p>
      )}

      <div className="mt-16 pb-8 text-center text-sm">
        Thank you for using the Free & Equal Election Assistant App Beta -
        please email{' '}
        <a
          href="mailto:info@freeandequal.org"
          target="_blank"
          className="underline underline-offset-2"
        >
          info@freeandequal.org
        </a>{' '}
        with any feedback.
      </div>
    </div>
  );
}
