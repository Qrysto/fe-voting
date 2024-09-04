import type { Metadata } from 'next';
import { kv } from '@vercel/kv';
import { Candidate, RCVResult } from '@/types';
import Round from './Round';
// import UpdatedTime from './UpdatedTime';
import Winner from './Winner';
import EndingTime from './EndingTime';
import { callNexusPrivate } from '@/app/lib/api';
import { rcvResultKVKey, ticker } from '@/constants/poll2';

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
  const candidates: Candidate[] = await callNexusPrivate(
    'assets/list/accounts',
    {
      where: `results.ticker=${ticker} AND results.active=1 AND results.choice=1`,
    },
    { revalidate: 86400 /* 24 hours */, tags: ['allPoll2Candidates'] }
  );

  return candidates;
}

async function loadRCVResult() {
  const result = await kv.get(rcvResultKVKey);
  return result as RCVResult | null;
}

export default async function RankingPage() {
  return null;
}
