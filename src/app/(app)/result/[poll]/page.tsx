import type { Metadata } from 'next';
import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Candidate, RCVResult } from '@/types';
import type { CallNexus } from '@/lib/api';
import allPolls from '@/constants/allPolls';
import { oswald } from '@/fonts';
import Round from './Round';
import UpdatedTime from './UpdatedTime';
import Winner from './Winner';
import EndingTime from './EndingTime';
import Poll1RankingPage from './poll1';

type Props = {
  params: { poll: string };
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

export async function generateStaticParams() {
  return Object.keys(allPolls).map((poll) => ({ poll }));
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

export default async function ResultPage({ params: { poll } }: Props) {
  if (!Object.keys(allPolls).includes(poll)) {
    notFound();
  }
  const { verifiable } = allPolls[poll];

  return (
    <main className="mt-6">
      {poll === 'poll1' ? <Poll1RankingPage /> : renderPollResult({ poll })}

      <div className="mt-16 text-center">
        {verifiable !== false ? (
          <Link
            href={`/verify?poll=${poll}`}
            className={`${oswald.className} mt-4 text-lg uppercase text-darkBlue underline underline-offset-2 active:text-darkBlue/80`}
          >
            Verify poll result
          </Link>
        ) : (
          <div className="text-sm text-foreground/60">
            This poll was beta tested on a private blockchain, therefore
            verification instruction for this poll is not available.
          </div>
        )}
      </div>

      <div className="mt-16 pb-8 text-center text-sm">
        Thank you for using the Free & Equal Election Assistant App - please
        email{' '}
        <a
          href="mailto:info@freeandequal.org"
          target="_blank"
          className="underline underline-offset-2"
        >
          info@freeandequal.org
        </a>{' '}
        with any feedback.
      </div>
    </main>
  );
}

async function renderPollResult({ poll }: { poll: string }) {
  const { pollName, pollTime, rcvResultKVKey, ticker, endTime, callNexus } =
    allPolls[poll];
  if (endTime > Date.now()) {
    revalidatePath(`/result/${poll}`, 'page');
  }
  const result = await loadRCVResult(rcvResultKVKey);
  const final = result?.final !== false; // old polls that don't have final property are also final
  const candidates = await loadRCVCandidates({
    callNexus,
    poll,
    ticker,
    final,
  });
  return (
    <>
      <h2 className="mt-4 text-xl uppercase">{pollName}</h2>
      <div>{pollTime}</div>
      {!final && <EndingTime endTime={endTime} />}

      <div className="mt-4 text-lg leading-6">
        Do you want to see more non-partisan debates with audience
        participation?{' '}
        <strong>
          <a
            className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
            href=" https://freeandequal.org/donate/"
            target="_blank"
          >
            Donate to Free & Equal
          </a>
        </strong>{' '}
        to support the production of our nationwide civic activism festival
        United We Stand 2025!
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
    </>
  );
}
