import { useState } from 'react';
import Image from 'next/image';
import BigButton from '@/components/BigButton';
import ConfirmVoteModal from './ConfirmVoteModal';
import { oswald } from '@/fonts';
import { candidates, Candidate } from '@/data';
import { useStore } from '@/store';

function Candidate({ candidate }: { candidate: Candidate }) {
  const addVote = useStore((state) => state.addVote);

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
        onClick={() => {
          addVote(candidate.id);
        }}
      >
        Vote
      </button>
    </li>
  );
}

function VotedCandidate({
  candidate,
  rank,
}: {
  candidate: Candidate | undefined;
  rank: number;
}) {
  const removeVote = useStore((state) => state.removeVote);
  if (!candidate) return null;
  const superscript =
    rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

  return (
    <li className="flex items-center px-5 py-[10px]">
      <div
        className={`relative mr-3 h-[45px] w-[45px] rounded-full bg-lightGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
      >
        <span>{rank}</span>
        <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
      </div>
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
                  : 'text-black'
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
        className={`${oswald.className} h-10 rounded-md px-3 font-bold uppercase text-gray/50`}
        onClick={() => {
          removeVote(candidate.id);
        }}
      >
        🗙
      </button>
    </li>
  );
}

export default function CastVote() {
  const votes = useStore((state) => state.votes);
  const resetVote = useStore((state) => state.resetVote);
  const [confirmingVote, setConfirmingVote] = useState(false);

  return (
    <div className="pb-8">
      <h2 className="mb-3 px-5 text-2xl uppercase">Candidates</h2>
      <div className="rounded-md bg-almostWhite py-[10px]">
        <ul>
          {votes.map((id, i) => (
            <VotedCandidate
              key={id}
              candidate={candidates.find((c) => c.id === id)}
              rank={i + 1}
            />
          ))}
        </ul>
        {votes.length > 0 && (
          <>
            <BigButton
              className="mt-6"
              primary
              disabled={votes.length !== 6}
              onClick={() => {
                setConfirmingVote(true);
              }}
            >
              Submit my votes
              {votes.length < 6 ? ` (${6 - votes.length} more)` : ''}
            </BigButton>
            <BigButton className="mb-6 mt-4" onClick={resetVote}>
              Reset all my votes
            </BigButton>
            <div className="my-[10px] border-t border-solid border-gray"></div>
          </>
        )}
        <ul>
          {candidates
            .filter((c) => !votes.includes(c.id))
            .map((candidate, i) => (
              <Candidate key={candidate.id} candidate={candidate} />
            ))}
        </ul>
      </div>

      <ConfirmVoteModal
        open={confirmingVote}
        close={() => {
          setConfirmingVote(false);
        }}
      />
    </div>
  );
}
