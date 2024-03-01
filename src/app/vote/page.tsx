import type { Metadata } from 'next';
import { Candidate } from '@/types';
import { endTime, tokenAddress } from '@/constants';
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

  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1 AND results.choice=1`
    )}`,
    {
      next: { revalidate: 300, tags: ['allCandidates'] },
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

  const result = await res.json();
  const allCandidates = result?.result.sort((c1: Candidate, c2: Candidate) =>
    c1.Last.localeCompare(c2.Last)
  );

  return <Steps allCandidates={allCandidates} />;
}
