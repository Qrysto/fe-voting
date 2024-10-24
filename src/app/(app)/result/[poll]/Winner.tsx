import { oswald } from '@/fonts';
import { Candidate, RCVResult } from '@/types';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import CandidateImage from '@/components/CandidateImage';
import { partyColor } from '@/lib/utils';
import crownImg from './crown.png';

export default function Winner({
  candidates,
  result,
  final,
}: {
  candidates: Candidate[];
  result: RCVResult;
  final: boolean;
}) {
  let winnerAddress: string | undefined = undefined;
  for (const round of Object.values(result.rounds)) {
    if (round.winner) {
      winnerAddress = round.winner;
      break;
    }
  }
  const winner = winnerAddress
    ? candidates.find((c) => c.address === winnerAddress)
    : null;

  if (!winner) {
    return <p className="mt-2 px-4 py-2">There is no winner</p>;
  }

  return (
    <Card className="mt-2 flex items-center px-4 py-[18px]">
      <CandidateImage
        candidate={winner}
        size={60}
        className="shrink-0 grow-0"
      />
      <div className="shrink grow px-4">
        <div>
          <span className="text-2xl font-bold text-darkBlue">
            {`${winner.First} ${winner.Last}`}
          </span>
        </div>
        <div className={`text-base font-bold uppercase ${oswald.className}`}>
          <span className={partyColor(winner.Party)}>{winner.Party}</span>
          {winner.Website === 'NONE' ? (
            <span className="ml-3 text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={winner.Website}
              target="_blank"
              className="ml-3 text-blue underline underline-offset-2"
            >
              Website
            </a>
          )}
        </div>
      </div>
      <div className="flex shrink-0 grow-0 flex-col items-center">
        <Image src={crownImg} width={48} height={48} alt="" />
        <div
          className={`text-center uppercase text-orange ${oswald.className}`}
        >
          {final ? 'Winner' : 'Current Winner'}
        </div>
      </div>
    </Card>
  );
}
