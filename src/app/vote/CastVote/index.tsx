import { useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';
import { useRouter } from 'next/navigation';
import BigButton from '@/components/BigButton';
import CandidateImage from '@/components/CandidateImage';
import ConfirmVoteModal from './ConfirmVoteModal';
import VoteConfirmedModal from './VoteConfirmedModal';
import CustomDragLayer from './CustomDragLayer';
import { oswald } from '@/fonts';
import { Candidate } from '@/types';
import { useStore } from '@/store';
import searchIcon from './search.svg';

function Candidate({
  candidate,
  disableVote,
}: {
  candidate: Candidate;
  disableVote: boolean;
}) {
  const addVote = useStore((state) => state.addVote);

  return (
    <li className="flex items-center px-4 py-[10px]">
      <CandidateImage candidate={candidate} className="shrink-0 grow-0" />
      <div className="shrink grow px-4">
        <div className="text-[17px] font-bold text-darkBlue">
          {`${candidate.First} ${candidate.Last}`}
        </div>
        <div className={`text-[11px] font-bold uppercase ${oswald.className}`}>
          <span
            className={
              candidate.Party.toUpperCase() === 'DEMOCRAT'
                ? 'text-blue'
                : candidate.Party.toUpperCase() === 'REPUBLICAN'
                  ? 'text-red'
                  : 'text-orange'
            }
          >
            {candidate.Party}
          </span>
          {candidate.Website === 'NONE' ? (
            <span className="ml-3 text-gray underline underline-offset-1">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="ml-3 text-blue underline underline-offset-1"
            >
              Website
            </a>
          )}
        </div>
      </div>
      <button
        className={`${oswald.className} ${
          disableVote
            ? 'bg-lightGray text-gray'
            : 'bg-lightBlue text-blue active:bg-lightBlue/60'
        } h-11 shrink-0 grow-0 rounded-md px-3 font-bold uppercase`}
        onClick={() => {
          addVote(candidate.address);
        }}
        disabled={disableVote}
      >
        Vote
      </button>
    </li>
  );
}

interface DragItem {
  rank: number;
  address: string;
  type: string;
}

export function VotedCandidate({
  candidate,
  rank,
}: {
  candidate: Candidate | undefined;
  rank: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const swapVotes = useStore((state) => state.swapVotes);
  const removeVote = useStore((state) => state.removeVote);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'candidate',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      // Don't replace items with themselves
      if (item.rank === rank) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (
        // Dragging downwards
        (item.rank < rank && hoverClientY < hoverMiddleY) ||
        // Dragging upwards
        (item.rank > rank && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      // Time to actually perform the action; index = rank - 1
      swapVotes(item.rank - 1, rank - 1);
      item.rank = rank;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'candidate',
    item: () => {
      return candidate ? { address: candidate.address, rank } : null;
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (!candidate) return null;
  const superscript =
    rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

  preview(drop(ref));
  return (
    <li
      ref={ref}
      className={`flex items-center px-4 py-[10px] ${
        isDragging ? 'opacity-30' : ''
      }`}
      data-handler-id={handlerId}
    >
      <div
        className={`relative mr-3 h-[45px] w-[45px] shrink-0 grow-0 rounded-full bg-lightGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
        ref={drag}
      >
        <span>{rank}</span>
        <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
      </div>
      <CandidateImage candidate={candidate} className="shrink-0 grow-0" />
      <div className="shrink grow px-4">
        <div className="text-[17px] font-bold text-darkBlue">
          {`${candidate.First} ${candidate.Last}`}
        </div>
        <div className={`text-[11px] font-bold uppercase ${oswald.className}`}>
          <span
            className={
              candidate.Party.toUpperCase() === 'DEMOCRAT'
                ? 'text-blue'
                : candidate.Party.toUpperCase() === 'REPUBLICAN'
                  ? 'text-red'
                  : 'text-orange'
            }
          >
            {candidate.Party}
          </span>
          {candidate.Website === 'NONE' ? (
            <span className="ml-3 text-gray underline underline-offset-1">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="ml-3 text-blue underline underline-offset-1"
            >
              Website
            </a>
          )}
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableTouchEvents: true,
        enableMouseEvents: true,
      }}
    >
      <div className="pb-8">
        <h2 className="px-4 text-4xl uppercase">Vote</h2>
        <p className="mt-[10px] px-4 text-lg leading-6">
          Please rank your top six candidates, you must select at least one
          candidate to vote.
        </p>
        <p className="mt-[10px] px-4 text-lg leading-6">
          E-mail{' '}
          <a
            href="mailto:info@freeandequal.org"
            className="text-blue underline underline-offset-1"
          >
            info@freeandequal.org
          </a>{' '}
          if you would like to be added.
        </p>
        <div className="flex items-end">
          <div className="shrink grow">
            <h2 className="mb-3 mt-8 px-4 text-2xl uppercase">Candidates</h2>
            {votes.length > 0 && (
              <p className="mt-[10px] px-4 text-lg leading-6">
                You can drag the position circles to reorder the candidates.
              </p>
            )}
          </div>
          <button
            className="shrink-0 grow-0 rounded-t-3xl bg-almostWhite px-5 pb-3 pt-5"
            onClick={() => {
              setSearchOpen(!searchOpen);
            }}
          >
            <Image
              src={searchIcon}
              alt="Search"
              width={22}
              height={22}
              className={`${searchOpen ? '' : 'opacity-70'}`}
            />
          </button>
        </div>
        <div className="rounded-l-md rounded-br-md bg-almostWhite py-[10px]">
          {searchOpen && (
            <div className="mx-4 mb-4 mt-2 flex items-center gap-2 border-b border-blue">
              <div className="shrink-0 grow-0">
                <Image src={searchIcon} alt="Search" width={16} height={16} />
              </div>
              <input
                type="search"
                autoFocus
                placeholder="Search for candidate"
                className="w-full shrink grow bg-transparent py-1 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <ul>
            {votes.map((address, i) => (
              <VotedCandidate
                key={address}
                candidate={allCandidates.find((c) => c.address === address)}
                rank={i + 1}
              />
            ))}
          </ul>
          <CustomDragLayer allCandidates={allCandidates} />
          {votes.length > 0 && (
            <>
              <BigButton
                className="mt-6"
                primary
                disabled={votes.length > 6}
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
              >
                Submit my votes
              </BigButton>
              <BigButton className="mb-6 mt-4" onClick={resetVote}>
                Reset all my votes
              </BigButton>
              <div className="my-[10px] border-t border-solid border-gray"></div>
            </>
          )}
          <ul>
            {allCandidates
              .filter(
                (c) =>
                  !votes.includes(c.address) &&
                  (!searchOpen ||
                    c.First.toLowerCase().includes(query.toLowerCase()) ||
                    c.Last.toLowerCase().includes(query.toLowerCase()))
              )
              .map((candidate) => (
                <Candidate
                  key={candidate.address}
                  candidate={candidate}
                  disableVote={votes.length >= 6}
                />
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
    </DndProvider>
  );
}
