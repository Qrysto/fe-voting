import { useState, useMemo } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BigButton from '@/components/BigButton';
import ConfirmVoteModal from './ConfirmVoteModal';
import VoteConfirmedModal from './VoteConfirmedModal';
import { oswald } from '@/fonts';
import { Candidate } from '@/types';
import { useStore } from '@/store';
import defaultAvatar from '@/default-avatar.jpg';

function Candidate({ candidate }: { candidate: Candidate }) {
  const addVote = useStore((state) => state.addVote);

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
        <div className="text-[17px] font-bold text-darkBlue">
          {candidate.Name}
        </div>
        <div className={`text-[11px] font-bold uppercase ${oswald.className}`}>
          <span
            className={
              candidate.Party === 'DEMOCRATIC PARTY'
                ? 'text-blue'
                : candidate.Party === 'REPUBLICAN PARTY'
                  ? 'text-red'
                  : 'text-orange'
            }
          >
            {candidate.Party}
          </span>
          <a
            href={candidate.Website}
            target="_blank"
            className="ml-3 text-blue underline underline-offset-1"
          >
            Website
          </a>
        </div>
      </div>
      <button
        className={`${oswald.className} h-11 shrink-0 grow-0 rounded-md bg-lightBlue px-3 font-bold uppercase text-blue active:bg-lightBlue/60`}
        onClick={() => {
          addVote(candidate.address);
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
    <li className="flex items-center px-4 py-[10px]">
      <div
        className={`relative mr-3 h-[45px] w-[45px] shrink-0 grow-0 rounded-full bg-lightGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
      >
        <span>{rank}</span>
        <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
      </div>
      <Image
        src={defaultAvatar}
        width={40}
        height={40}
        alt={candidate.Name}
        className="shrink-0 grow-0 rounded-md"
      />
      <div className="shrink grow px-4">
        <div className="text-[17px] font-bold text-darkBlue">
          {candidate.Name}
        </div>
        <div className={`text-[11px] font-bold uppercase ${oswald.className}`}>
          <span
            className={
              candidate.Party === 'DEMOCRATIC PARTY'
                ? 'text-blue'
                : candidate.Party === 'REPUBLICAN PARTY'
                  ? 'text-red'
                  : 'text-orange'
            }
          >
            {candidate.Party}
          </span>
          <a
            href={candidate.Website}
            target="_blank"
            className="ml-3 text-blue underline underline-offset-1"
          >
            Website
          </a>
        </div>
      </div>
      <button
        className={`${oswald.className} h-10 shrink-0 grow-0 rounded-md px-3 font-bold uppercase text-gray/50`}
        onClick={() => {
          removeVote(candidate.address);
        }}
      >
        ✖
      </button>
    </li>
  );
}

// function shuffle<T>(array: T[]) {
//   let currentIndex = array.length,
//     randomIndex;

//   // While there remain elements to shuffle.
//   while (currentIndex > 0) {
//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }

//   return array;
// }

export default function CastVote() {
  const allCandidates = useStore((state) => state.allCandidates);
  // const shuffledCandidates = useMemo(
  //   () => shuffle([...allCandidates]),
  //   [allCandidates]
  // );
  const jwToken = useStore((state) => state.jwToken);
  const votes = useStore((state) => state.votes);
  const resetVote = useStore((state) => state.resetVote);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="pb-8">
      <h2 className="px-4 text-4xl uppercase">Vote</h2>
      <p className="mt-[10px] px-4 text-lg leading-6">
        Please rank your top six candidates for the upcoming independent debate.
      </p>
      <h2 className="mb-3 mt-8 px-4 text-2xl uppercase">Candidates</h2>
      <div className="rounded-md bg-almostWhite py-[10px]">
        <ul>
          {votes.map((address, i) => (
            <VotedCandidate
              key={address}
              candidate={allCandidates.find((c) => c.address === address)}
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
                setConfirmModalOpen(true);
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
          {allCandidates
            .filter((c) => !votes.includes(c.address))
            .map((candidate) => (
              <Candidate key={candidate.address} candidate={candidate} />
            ))}
        </ul>
      </div>

      <ConfirmVoteModal
        open={confirmModalOpen}
        close={() => {
          setConfirmModalOpen(false);
        }}
        confirmVote={async () => {
          try {
            await axios.post('/api/vote', { jwToken, votes });
          } catch (err: any) {
            console.error(err);
            alert('ERROR! ' + err?.message);
            return;
          }
          setConfirmModalOpen(false);
          setConfirmedModalOpen(true);
        }}
      />
      <VoteConfirmedModal
        open={confirmedModalOpen}
        close={() => {
          router.push('/ranking');
        }}
      />
    </div>
  );
}
