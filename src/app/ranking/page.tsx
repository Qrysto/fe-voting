import Image from 'next/image';
import { oswald } from '@/fonts';
import { Candidate } from '@/data';
import defaultAvatar from '@/default-avatar.jpg';

interface Rank {
  id: string;
  voteCount: string;
  percentage: number;
}

const ranks: Rank[] = [
  {
    id: '4',
    voteCount: '48M',
    percentage: 56,
  },
  {
    id: '2',
    voteCount: '3M',
    percentage: 24,
  },
  {
    id: '5',
    voteCount: '125K',
    percentage: 6,
  },
];

function RankedCandidate({ candidate }: { candidate: Candidate }) {
  return (
    <li className="flex items-center px-4 py-[10px]">
      <Image
        src={defaultAvatar}
        width={40}
        height={40}
        alt={candidate.Name}
        className="shrink-0 grow-0 rounded-md"
      />
      <div className="shrink grow px-4">
        <div>
          <span className="text-[17px] font-bold text-darkBlue">
            {candidate.Name} -{' '}
          </span>
          <span>{candidate.balance} Votes</span>
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
  const allCandidates: Candidate[] = result?.result
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
      <h2 className="mb-3 px-4 text-2xl uppercase">Current ranking</h2>
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
