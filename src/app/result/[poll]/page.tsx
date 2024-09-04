import type { Metadata } from 'next';
import { kv } from '@vercel/kv';
import { redirect } from 'next/navigation';
import { Candidate, RCVResult } from '@/types';
// import { rcvResultKVKey, ticker } from '@/constants/activePoll';
import * as poll2 from '@/constants/poll2';
import * as poll3 from '@/constants/poll3Staging';
import type { CallNexus } from '@/lib/api';
import Round from './Round';
import UpdatedTime from './UpdatedTime';
import Winner from './Winner';
import EndingTime from './EndingTime';
import Poll1RankingPage from './poll1';

type Props = {
  params: { poll: string };
};

const pollConstants: Record<string, any> = {
  poll2,
  poll3,
};

export async function generateMetadata({
  params: { poll },
}: Props): Promise<Metadata> {
  return {
    title: 'Results | Free And Equal',
    description: 'View the results of the current vote! Powered by nexus.io.',
    openGraph: {
      title: 'Results | Free And Equal',
      description: 'View the results of the current vote! Powered by nexus.io.',
      url: `https://vote.freeandequal.org/result/${poll}`,
      type: 'website',
      siteName: 'Free And Equal Voting App',
    },
  };
}

async function loadRCVCandidates({
  callNexus,
  poll,
  ticker,
  final,
}: {
  callNexus: CallNexus;
  poll: string;
  ticker: string;
  final: boolean;
}) {
  const candidates: Candidate[] = await callNexus(
    'assets/list/accounts',
    {
      where: `results.ticker=${ticker} AND results.active=1`,
    },
    {
      revalidate: final ? 86400 /* 24 hours */ : 60 /* 1 minute */,
      tags: [`allCandidates-${poll}`],
    }
  );

  return candidates;
}

async function loadRCVResult(rcvResultKVKey: string) {
  const result = await kv.get(rcvResultKVKey);
  return result as RCVResult | null;
}

export default async function RankingPage({ params: { poll } }: Props) {
  if (poll === 'poll1') {
    return <Poll1RankingPage />;
  }
  if (!Object.keys(pollConstants).includes(poll)) {
    redirect('/');
  }

  const { rcvResultKVKey, ticker, endTime, callNexus } = pollConstants[poll];
  const result = await loadRCVResult(rcvResultKVKey);
  const final = result?.final !== false; // old polls that doesn't have final property is also final
  const candidates = await loadRCVCandidates({
    callNexus,
    poll,
    ticker,
    final,
  });

  return (
    <div className="mt-6">
      <h2 className="mt-4 text-xl uppercase">
        2024 Free and Equal Presidential Debate at FreedomFest Winner Poll
      </h2>
      <div className="mb-3">July 12nd - July 15th, 2024</div>
      {!final && <EndingTime endTime={endTime} />}

      <div className="text-lg leading-6">
        Do you want to see more non-partisan debates with audience
        participation?{' '}
        <strong>
          <a
            className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
            href="https://givebutter.com/free-and-equal-debate"
            target="_blank"
          >
            Donate to Free & Equal
          </a>
        </strong>{' '}
        to support the production of our fourth presidential debate in
        September!
      </div>

      <h1 className="mt-8 text-3xl uppercase text-darkBlue">
        {final ? 'Final result' : 'Current result'}
      </h1>
      {result ? (
        <>
          {!final && <UpdatedTime timeStamp={result.timeStamp} />}
          <div className="mt-6">
            <h2 className="text-2xl uppercase text-darkBlue">
              {final ? 'Winner' : 'Current winner'}
            </h2>
            <Winner candidates={candidates} result={result} final={final} />
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
                final={final}
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
