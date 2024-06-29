import type { Metadata } from 'next';
import { Candidate } from '@/types';
import { endTime, tokenAddress } from '@/constants';
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
  const pollEnded = Date.now() > endTime;
  if (pollEnded) {
    return <div className="mt-12 text-center">The poll has ended.</div>;
  }

  const result = await callNexus(
    'assets/list/accounts',
    {
      where: `results.token=${tokenAddress} AND results.active=1 AND results.choice=1`,
    },
    {
      revalidate: 300,
      tags: ['allCandidates'],
    }
  );

  const allCandidates = result?.result.sort((c1: Candidate, c2: Candidate) =>
    c1.Last.localeCompare(c2.Last)
  );

  return <Steps allCandidates={allCandidates} />;
}
