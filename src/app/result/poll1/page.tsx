import type { Metadata } from 'next';
import { oswald } from '@/fonts';
import { Candidate } from '@/types';
import CandidateImage from '@/components/CandidateImage';
import { callNexusPrivate } from '@/app/lib/api';

const format = Intl.NumberFormat('en-US').format;

export const metadata: Metadata = {
  title: 'Results | Free And Equal',
  description: 'View the results of the current vote! Powered by nexus.io.',
  openGraph: {
    title: 'Results | Free And Equal',
    description: 'View the results of the current vote! Powered by nexus.io.',
    url: 'https://vote.freeandequal.org/result/poll1',
    type: 'website',
    siteName: 'Free And Equal Voting App',
  },
};

function RankedCandidate({ candidate }: { candidate: Candidate }) {
  return (
    <li className="flex items-center px-4 py-[10px]">
      <CandidateImage candidate={candidate} className="shrink-0 grow-0" />
      <div className="shrink grow px-4">
        <div>
          <span className="text-[17px] font-bold text-darkBlue">
            {`${candidate.First} ${candidate.Last}`} -{' '}
          </span>
          <span className="whitespace-nowrap">
            {format(candidate.balance)} Points
          </span>
        </div>
        <div className="relative h-4 rounded-[4px] bg-gray/15">
          <div
            className="absolute inset-y-0 left-0 h-4 rounded-[4px] bg-green"
            style={{ width: candidate.percentage + '%' }}
          ></div>
        </div>
      </div>
      <div
        className={`w-10 shrink-0 grow-0 rounded-full text-right font-bold ${oswald.className}`}
      >
        {candidate.percentage}%
      </div>
    </li>
  );
}

export default async function RankingPage() {
  return null;
}
