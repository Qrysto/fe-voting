import { oswald } from '@/fonts';
import { Candidate, Round, RCVResult } from '@/types';
import CandidateImage from '@/components/CandidateImage';

export default function Winner({
  candidates,
  result,
}: {
  candidates: Candidate[];
  result: RCVResult;
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
    <li className="mt-2 flex items-center rounded-md bg-almostWhite px-4 py-[18px]">
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
          <span
            className={
              winner.Party.toUpperCase() === 'DEMOCRAT'
                ? 'text-blue'
                : winner.Party.toUpperCase() === 'REPUBLICAN'
                  ? 'text-red'
                  : 'text-orange'
            }
          >
            {winner.Party}
          </span>
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
    </li>
  );
}
