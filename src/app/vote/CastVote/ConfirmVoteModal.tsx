import { Candidate } from '@/types';
import { useStore } from '@/store';
import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import Image from 'next/image';
import { oswald } from '@/fonts';
import thumbsupImg from './thumbsup-small.svg';
import defaultAvatar from '@/default-avatar.jpg';

function VotedCandidate({ address, rank }: { address: string; rank: number }) {
  const allCandidates = useStore((state) => state.allCandidates);
  const candidate = allCandidates.find((c) => c.address === address);
  if (!candidate) return null;
  const superscript =
    rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

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
      <div
        className={`relative h-[45px] w-[45px] shrink-0 grow-0 rounded-full bg-lightGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
      >
        <span>{rank}</span>
        <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
      </div>
    </li>
  );
}

export default function ConfirmVoteModal({
  open,
  close,
  confirmVote,
}: {
  open?: boolean;
  close: () => void;
  confirmVote: () => void;
}) {
  const votes = useStore((state) => state.votes);
  const resetVote = useStore((state) => state.resetVote);

  return (
    <Modal open={open} close={close}>
      <div className="absolute inset-0 flex flex-col items-stretch px-6 py-7">
        <Image
          src={thumbsupImg}
          alt=""
          className="absolute right-4 top-4 w-[112px]"
        />
        <h1 className="mt-14 text-4xl uppercase">Confirm vote</h1>
        <p className="mt-[10px]">
          Please confirm you rank selection is correct below.
        </p>
        <ul className="my-4 shrink grow overflow-y-auto rounded-[46px] bg-almostWhite py-4">
          {votes.map((address, i) => (
            <VotedCandidate key={address} address={address} rank={i + 1} />
          ))}
        </ul>
        <BigButton
          className="mt-4"
          primary
          disabled={votes.length !== 6}
          onClick={confirmVote}
        >
          Confirm my votes
          {votes.length < 6 ? ` (${6 - votes.length} more)` : ''}
        </BigButton>
        <BigButton
          className="mt-4"
          onClick={() => {
            resetVote();
            close();
          }}
        >
          Reset all my votes
        </BigButton>
      </div>
    </Modal>
  );
}
