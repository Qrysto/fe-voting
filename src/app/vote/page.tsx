import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Candidate } from '@/types';
import { endTime, ticker, pollName } from '@/constants/activePoll';
import { callNexus } from '@/app/lib/api';
import Steps from './Steps';

export const metadata: Metadata = {
  title: 'Vote! | Free And Equal',
  description:
    'Vote for your top six candidates for the upcoming presidential debate! Powered by nexus.io.',
  openGraph: {
    title: 'Vote! | Free And Equal',
    description:
      'Vote for your top six candidates for the upcoming presidential debate! Powered by nexus.io.',
    url: 'https://vote.freeandequal.org/vote',
    type: 'website',
    siteName: 'Free And Equal Voting App',
  },
};

export default async function VotePage() {
  // const pollEnded = Date.now() > endTime;
  // if (pollEnded) {
  //   redirect(`/result/${pollName}`);
  //   return <div className="mt-12 text-center">The poll has ended.</div>;
  // }

  const result = await callNexus(
    'assets/list/accounts',
    {
      where: `results.ticker=${ticker} AND results.active=1`,
    },
    {
      revalidate: 300,
      tags: ['allCandidates'],
    }
  );

  const allCandidates = result?.sort((c1: Candidate, c2: Candidate) =>
    c1.Last.localeCompare(c2.Last)
  );

  return <Steps allCandidates={allCandidates} />;
}
