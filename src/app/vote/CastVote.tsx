import Image from 'next/image';
import { oswald } from '@/fonts';
import { candidates, Candidate } from '@/data';

function Candidate({ candidate }: { candidate: Candidate }) {
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
        <div className="text-[17px] font-bold text-darkBlue">
          {candidate.name}
        </div>
        <div className={`text-[11px] font-bold uppercase ${oswald.className}`}>
          <span
            className={
              candidate.party === 'DEMOCRAT'
                ? 'text-blue'
                : candidate.party === 'REPUBLICAN'
                  ? 'text-red'
                  : 'text-gray'
            }
          >
            {candidate.party}
          </span>
          <span className="ml-3 text-blue underline underline-offset-1">
            Website
          </span>
        </div>
      </div>
      <button
        className={`${oswald.className} h-11 rounded-md bg-lightBlue px-3 font-bold uppercase text-blue`}
      >
        Vote
      </button>
    </li>
  );
}

export default function CastVote() {
  return (
    <div className="pb-8">
      <h2 className="mb-3 px-5 text-2xl uppercase">Candidates</h2>
      <ul className="bg-almostWhite rounded-md py-[10px]">
        {candidates.map((candidate, i) => (
          <Candidate key={i} candidate={candidate} />
        ))}
        {candidates.map((candidate, i) => (
          <Candidate key={i} candidate={candidate} />
        ))}
      </ul>
    </div>
  );
}
