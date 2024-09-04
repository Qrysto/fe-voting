import { useState, useRef, useMemo } from 'react';
import type { MouseEvent } from 'react';
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
import { maxChoices } from '@/constants/activePoll';
import type { Candidate } from '@/types';
import { useStore } from '@/store';
import { toE164US } from '@/app/lib/phone';
import { partyColor } from '@/app/lib/utils';
import searchIcon from './search.svg';
import filterIcon from './filter.svg';

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
          <span className={partyColor(candidate.Party)}>{candidate.Party}</span>
          {candidate.Website === 'NONE' ? (
            <span className="ml-3 text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="ml-3 text-blue underline underline-offset-2"
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
          <span className={partyColor(candidate.Party)}>{candidate.Party}</span>
          {candidate.Website === 'NONE' ? (
            <span className="ml-3 text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="ml-3 text-blue underline underline-offset-2"
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
  const parties = useMemo(() => {
    const parties: { [key: string]: any } = {};
    allCandidates.forEach((c: Candidate) => {
      parties[c.Party] = true;
    });
    return Object.keys(parties).sort();
  }, [allCandidates]);
  // const shuffledCandidates = useMemo(
  //   () => shuffle([...allCandidates]),
  //   [allCandidates]
  // );
  const phoneNumber = useStore((state) => state.phoneNumber);
  const jwtToken = useStore((state) => state.jwtToken);
  const votes = useStore((state) => state.votes);
  const resetPhoneNumber = useStore((state) => state.resetPhoneNumber);
  const unconfirmCode = useStore((state) => state.unconfirmCode);
  const resetVote = useStore((state) => state.resetVote);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  const router = useRouter();
  const [filterOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedParty, selectParty] = useState<string | null>(null);
  const displayedCandidates = useMemo(
    () =>
      allCandidates.filter((c) => {
        // Don't show voted candidates
        if (votes.includes(c.address)) return false;
        // No need to filter if filter is not open
        if (!filterOpen) return true;
        // Else, filter by query
        if (query) {
          const lQuery = query.toLowerCase();
          return (
            c.First.toLowerCase().includes(lQuery) ||
            c.Last.toLowerCase().includes(lQuery)
          );
        }
        // Filter by party
        if (selectedParty) {
          return c.Party === selectedParty;
        }
        // Default
        return true;
      }),
    [allCandidates, filterOpen, query, selectedParty, votes]
  );

  const changePhoneNumber = (e: MouseEvent) => {
    e.preventDefault();
    resetPhoneNumber();
    unconfirmCode();
  };

  return (
    <DndProvider
      backend={TouchBackend}
      options={{
        enableTouchEvents: true,
        enableMouseEvents: true,
      }}
    >
      <div className="">
        <h2 className="px-4 text-4xl uppercase">Vote</h2>

        <p className="mt-[10px] px-4 text-lg leading-6">
          Take a moment to reflect on the candidate&#39;s positions. If you need
          a refresher,{' '}
          <a
            target="_blank"
            href="https://freeandequal.org/debate/free-equal-presidential-debate-july-12-2024/"
            className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
          >
            click here to watch
          </a>
          .
        </p>
        <p className="mt-[10px] px-4 text-lg leading-6">
          Select the candidate you believe won the debate by clicking on their
          name below. Take a moment to reflect on the debate performances.
        </p>
        <p className="mt-4 px-4 italic">
          You&apos;re voting as <strong>{toE164US(phoneNumber)}</strong>.{' '}
          <a
            href="#"
            className="underline underline-offset-2"
            onClick={changePhoneNumber}
          >
            Change phone number
          </a>
        </p>

        <div className="flex items-end">
          <div className="shrink grow">
            <h2 className="mb-3 mt-8 px-4 text-2xl uppercase">Candidates</h2>
            <p className="mt-[10px] px-4 text-lg leading-6">
              This poll uses{' '}
              <a
                target="_blank"
                href="https://fairvote.org/our-reforms/ranked-choice-voting/"
                className="text-darkBlue underline underline-offset-2 active:text-darkBlue/90"
              >
                Ranked Choice Voting
              </a>
              .
            </p>
            {votes.length > 0 && (
              <p className="mt-2 px-4 text-lg leading-6">
                You can drag the position circles to reorder the candidates.
              </p>
            )}
          </div>
          <button
            className="shrink-0 grow-0 rounded-t-3xl bg-almostWhite px-5 pb-3 pt-5"
            onClick={() => {
              setSearchOpen(!filterOpen);
            }}
          >
            <Image
              src={filterIcon}
              alt="Filter"
              width={26}
              className={`${filterOpen ? '' : 'opacity-70'}`}
            />
          </button>
        </div>
        <div className="rounded-l-md rounded-br-md bg-almostWhite py-[10px]">
          {filterOpen && (
            <>
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
              <div className="mx-4 flex flex-wrap gap-2 pb-3">
                {parties.map((party) => (
                  <button
                    key={party}
                    className={`shrink-0 grow-0 rounded-md border px-3 py-[2px] ${
                      selectedParty === party
                        ? 'border-blue bg-lightBlue'
                        : 'border-gray'
                    }`}
                    onClick={() => {
                      if (selectedParty === party) {
                        selectParty(null);
                      } else {
                        selectParty(party);
                      }
                    }}
                  >
                    <span
                      className={`text-[11px] font-bold uppercase ${
                        oswald.className
                      } ${partyColor(party)}`}
                    >
                      {party}
                    </span>
                  </button>
                ))}
              </div>
            </>
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
            {displayedCandidates.map((candidate) => (
              <Candidate
                key={candidate.address}
                candidate={candidate}
                disableVote={votes.length >= maxChoices}
              />
            ))}
          </ul>
        </div>

        <div className="mt-16 pb-8 text-center text-sm">
          Thank you for using the Free & Equal Election Assistant App Beta -
          please email{' '}
          <a
            href="mailto:info@freeandequal.org"
            target="_blank"
            className="underline underline-offset-2"
          >
            info@freeandequal.org
          </a>{' '}
          with any feedback.
        </div>

        <ConfirmVoteModal
          open={confirmModalOpen}
          close={() => {
            setConfirmModalOpen(false);
          }}
          confirmVote={async () => {
            try {
              // await axios.post('/api/vote', { jwtToken, votes });
            } catch (err: any) {
              console.log(err);
              alert(
                'ERROR! ' + err?.response.data?.message ||
                  err?.message ||
                  'Unknown error'
              );
              return;
            }
            setConfirmModalOpen(false);
            setConfirmedModalOpen(true);
          }}
        />
        <VoteConfirmedModal
          open={confirmedModalOpen}
          close={() => {
            router.push('/result/poll3');
          }}
        />
      </div>
    </DndProvider>
  );
}
