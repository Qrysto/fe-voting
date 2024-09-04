import { oswald } from '@/fonts';
import type { Candidate, Round } from '@/types';
import CandidateImage from '@/components/CandidateImage';
import { partyColor } from '@/app/lib/utils';

const format = Intl.NumberFormat('en-US').format;

function RankedCandidate({
  candidate,
  total,
  voteCount,
  eliminated,
  winner,
  final,
}: {
  candidate: Candidate;
  total: number;
  voteCount: number;
  eliminated: boolean;
  winner: boolean;
  final: boolean;
}) {
  return (
    <li className="flex items-center px-4 py-2">
      <CandidateImage candidate={candidate} className="shrink-0 grow-0" />
      <div className="shrink grow px-4">
        <div>
          <span className="text-[17px] font-bold text-darkBlue">
            {`${candidate.First} ${candidate.Last}`}
          </span>
        </div>

        <div className={`${oswald.className} text-xs font-bold uppercase`}>
          <span className={`${partyColor(candidate.Party)}`}>
            {candidate.Party}
          </span>
          &nbsp;
          {candidate.Website === 'NONE' ? (
            <span className="ml-2 text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className={'ml-2 text-blue underline underline-offset-2'}
            >
              Website
            </a>
          )}
        </div>

        <div className="relative mt-2 h-6 rounded-[4px] bg-gray/15">
          <div
            className="absolute inset-y-0 left-0 h-6 rounded-[4px] bg-lightGreen"
            style={{ width: (100 * voteCount) / total + '%' }}
          ></div>

          <div
            className={`absolute inset-y-0 left-2 h-6 text-sm font-medium leading-6 text-darkBlue ${oswald.className}`}
          >
            {format(voteCount)} votes
            {eliminated ? (
              <span>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <span
                  className={`text-[12px] font-bold uppercase ${oswald.className}`}
                >
                  Least Votes
                </span>
              </span>
            ) : (
              ''
            )}
            {winner ? (
              <span>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <span
                  className={`text-[12px] font-bold uppercase ${oswald.className}`}
                >
                  {final ? 'Winner!' : 'Current Winner!'}
                </span>
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <div
        className={`w-14 shrink-0 grow-0 rounded-full text-right font-bold ${oswald.className}`}
      >
        {total ? Math.round((10000 * voteCount) / total) / 100 : 0}%
      </div>
    </li>
  );
}

function toOrdinal(num: number) {
  switch (num) {
    case 1:
      return 'First';
    case 2:
      return 'Second';
    case 3:
      return 'Third';
    case 4:
      return 'Fourth';
    case 5:
      return 'Fifth';
    case 6:
      return 'Sixth';
  }
}

export default function Round({
  candidates,
  roundNo,
  round,
  final,
}: {
  candidates: Candidate[];
  roundNo: number;
  round: Round;
  final: boolean;
}) {
  const total = Object.values(round.voteCount).reduce(
    (total, voteCount) => total + voteCount,
    0
  );
  const superscript =
    roundNo === 1 ? 'ST' : roundNo === 2 ? 'ND' : roundNo === 3 ? 'RD' : 'TH';

  return (
    <div className="mt-6">
      <h3 className="flex items-center px-4 text-xl uppercase">
        <div
          className={`bg-lighterGreen relative mr-3 h-[45px] w-[45px] shrink-0 grow-0 rounded-full pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
        >
          <span>{roundNo}</span>
          <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
        </div>
        <div className="">{toOrdinal(roundNo)} Round</div>
      </h3>
      <div className="mt-2 rounded-md bg-almostWhite py-[10px]">
        <ul>
          {candidates
            .filter((c) => round.voteCount[c.address] !== undefined)
            .sort(
              (c1, c2) =>
                round.voteCount[c2.address] - round.voteCount[c1.address]
            )
            .map((candidate) => (
              <RankedCandidate
                key={candidate.address}
                candidate={candidate}
                voteCount={round.voteCount[candidate.address]}
                total={total}
                eliminated={round.eliminated === candidate.address}
                winner={round.winner === candidate.address}
                final={final}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
