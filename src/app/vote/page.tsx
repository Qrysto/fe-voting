import type { Metadata } from 'next';
import Steps from './Steps';
import { Candidate } from '@/types';

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
  const res = await fetch('http://node5.nexus.io:7080/assets/list/accounts', {
    next: { revalidate: 60, tags: ['allCandidates'] },
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
    },
  });
  if (!res.ok) {
    console.error('assets/list/accounts', res.status, res.body);
    const err = await res.json();
    throw err;
  }

  const result = await res.json();
  const allCandidates = result?.result
    ?.filter((c: Candidate) => c.active)
    .sort((c1: Candidate, c2: Candidate) => c1.Last.localeCompare(c2.Last));

  return <Steps allCandidates={allCandidates} />;
}
