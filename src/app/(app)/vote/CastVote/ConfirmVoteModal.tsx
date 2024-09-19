import { useStore } from '@/store';
import Modal from '@/components/Modal';
import BigButton from '@/components/BigButton';
import CandidateImage from '@/components/CandidateImage';
import Image from 'next/image';
import { partyColor } from '@/lib/utils';
import { oswald } from '@/fonts';
import thumbsupImg from './thumbsup-small.svg';

function VotedCandidate({ address, rank }: { address: string; rank: number }) {
  const allCandidates = useStore((state) => state.allCandidates);
  const candidate = allCandidates.find((c) => c.address === address);
  if (!candidate) return null;
  const superscript =
    rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

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
      <div
        className={`bg-lighterGreen relative h-[45px] w-[45px] shrink-0 grow-0 rounded-full pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
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
  confirmVote: () => Promise<void>;
}) {
  const votes = useStore((state) => state.votes);
  const resetVote = useStore((state) => state.resetVote);

  return (
    <Modal open={open} close={close}>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-stretch px-6 py-7">
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
        <BigButton className="mt-4 flex-shrink-0" primary action={confirmVote}>
          Confirm my votes
        </BigButton>
        <BigButton
          className="mt-4 flex-shrink-0"
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
