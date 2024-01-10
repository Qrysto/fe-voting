import Image from 'next/image';
import { oswald } from '@/fonts';
import { candidates } from '@/data';

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

function RankedCandidate({ rank }: { rank: Rank }) {
  const candidate = candidates.find((c) => c.id === rank.id);
  if (!candidate) return null;

  return (
    <li className="flex items-center px-5 py-[10px]">
      <Image
        src={candidate.thumbnail}
        width={40}
        height={40}
        alt={candidate.name}
        className="rounded-md"
      />
      <div className="shrink grow px-4">
        <div>
          <span className="text-[17px] font-bold text-darkBlue">
            {candidate.name} -{' '}
          </span>
          <span>{rank.voteCount} Votes</span>
        </div>
        <div className="relative h-4 rounded-[4px] bg-gray/15">
          <div
            className="absolute inset-y-0 left-0 h-4 rounded-[4px] bg-green"
            style={{ width: rank.percentage + '%' }}
          ></div>
        </div>
      </div>
      <div className={`rounded-full font-bold ${oswald.className}`}>
        {rank.percentage}%
      </div>
    </li>
  );
}

export default function RankingPage() {
  return (
    <div className="mt-10">
      <h2 className="mb-3 px-5 text-2xl uppercase">Current ranking</h2>
      <div className="rounded-md bg-almostWhite py-[10px]">
        <ul>
          {ranks.map((rank, i) => (
            <RankedCandidate key={i} rank={rank} />
          ))}
        </ul>
      </div>
    </div>
  );
}
