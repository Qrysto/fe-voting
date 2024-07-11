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
  const result = await callNexusPrivate(
    'assets/list/accounts',
    { where: 'results.ticker=votes AND results.active=1' },
    { revalidate: 86400 /* 24 hours */, tags: ['allPoll1Candidates'] }
  );

  const allCandidates: Candidate[] = result
    ?.filter((c: Candidate) => c.active)
    .sort((c1: Candidate, c2: Candidate) => c2.balance - c1.balance);
  const totalVotes = allCandidates.reduce(
    (total, candidate) => total + candidate.balance,
    0
  );
  allCandidates.forEach((candidate) => {
    candidate.percentage =
      Math.round((10000 * candidate.balance) / totalVotes) / 100;
  });

  return (
    <div className="mt-10">
      <h2 className="mt-4 px-4 text-xl uppercase">Candidate Selection Poll</h2>
      <div className="mb-3 px-4">January 18th - February 1st, 2024</div>
      <p className="mb-3 mt-2 px-4">
        This poll used Borda count voting. Each voter can choose at most 6
        candidates to vote. First choice of each vote worths 6 points, second
        choice worths 5 points, and so on... Candidates will then be ranked by
        the total number of points they receive.
      </p>
      <h2 className="mt-4 px-4 text-2xl uppercase">Final ranking</h2>
      <div className="mb-3 px-4 font-bold">
        Total allocated points: {format(totalVotes)}
      </div>
      <div className="rounded-md bg-almostWhite py-[10px]">
        <ul>
          {allCandidates.map((candidate) => (
            <RankedCandidate key={candidate.address} candidate={candidate} />
          ))}
        </ul>
      </div>
    </div>
  );
}
