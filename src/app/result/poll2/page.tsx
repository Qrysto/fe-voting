import type { Metadata } from 'next';
import { oswald } from '@/fonts';
import { Candidate, Choice } from '@/types';
import CandidateImage from '@/components/CandidateImage';
import { maxChoices, tokenAddress } from '@/constants';

const format = Intl.NumberFormat('en-US').format;

export const metadata: Metadata = {
  title: 'Results | Free And Equal',
  description: 'View the results of the current vote! Powered by nexus.io.',
  openGraph: {
    title: 'Results | Free And Equal',
    description: 'View the results of the current vote! Powered by nexus.io.',
    url: 'https://vote.freeandequal.org/result/poll2',
    type: 'website',
    siteName: 'Free And Equal Voting App',
  },
};

function fillColor(choice: number) {
  switch (choice) {
    case 1:
      return 'bg-green';
    case 2:
      return 'bg-green/85';
    case 3:
      return 'bg-green/70';
    case 4:
      return 'bg-green/55';
    case 5:
      return 'bg-green/40';
    case 6:
      return 'bg-green/25';
  }
  return 'bg-gray';
}

function RankedCandidate({
  candidate,
  total,
  voteCount,
  choice,
}: {
  candidate: Candidate;
  total: number;
  voteCount: number;
  choice: number;
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
        <div className="relative h-4 rounded-[4px] bg-gray/15">
          <div
            className={`absolute inset-y-0 left-0 h-4 rounded-[4px] ${fillColor(
              choice
            )}`}
            style={{ width: (100 * voteCount) / total + '%' }}
          ></div>
        </div>
      </div>
      <div
        className={`w-14 shrink-0 grow-0 rounded-full text-right font-bold ${oswald.className}`}
      >
        {format(voteCount)}
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
      return 'Forth';
    case 5:
      return 'Fifth';
    case 6:
      return 'Sixth';
  }
}

function RankingByChoice({
  candidates,
  votesByChoice,
  choice,
}: {
  candidates: Candidate[];
  votesByChoice: VotesByChoice;
  choice: number;
}) {
  const total = candidates.reduce(
    (total, candidate) => total + votesByChoice[candidate.address][choice],
    0
  );
  const superscript =
    choice === 1 ? 'ST' : choice === 2 ? 'ND' : choice === 3 ? 'RD' : 'TH';

  return (
    <div className="mt-6">
      <h3 className="flex items-center px-4 text-xl uppercase">
        <div
          className={`relative mr-3 h-[45px] w-[45px] shrink-0 grow-0 rounded-full bg-lightGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
        >
          <span>{choice}</span>
          <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
        </div>
        <div className="">{toOrdinal(choice)}-Choice Votes</div>
      </h3>
      <div className="mt-2 rounded-md bg-almostWhite py-[10px]">
        <ul>
          {candidates
            .sort(
              (c1, c2) =>
                votesByChoice[c2.address][choice] -
                votesByChoice[c1.address][choice]
            )
            .map((candidate) => (
              <RankedCandidate
                key={candidate.address}
                candidate={candidate}
                voteCount={votesByChoice[candidate.address][choice]}
                total={total}
                choice={choice}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

async function loadRCVCandidates() {
  const res = await fetch(
    `http://node5.nexus.io:7080/assets/list/accounts?where=${encodeURIComponent(
      `results.token=${tokenAddress} AND results.active=1`
    )}`,
    {
      next: { revalidate: 10, tags: ['allChoices'] },
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      },
    }
  );
  if (!res.ok) {
    console.error('assets/list/accounts', res.status, res.body);
    const err = await res.json();
    throw err;
  }

  const result = await res.json();
  const allChoices: Choice[] = result?.result;
  const candidates: Candidate[] = [];
  const votesByChoice: VotesByChoice = {};
  allChoices.forEach((c) => {
    if (c.choice === 1) {
      candidates.push(c as Candidate);
      votesByChoice[c.address] = { 1: c.balance };
    }
  });
  allChoices.forEach((c) => {
    if (c.choice > 1 && votesByChoice[c.reference]) {
      votesByChoice[c.reference][c.choice] = c.balance;
    }
  });

  return { candidates, votesByChoice };
}

export default async function RankingPage() {
  const { candidates, votesByChoice } = await loadRCVCandidates();
  const choices = [];
  for (let i = 1; i <= maxChoices; i++) {
    choices.push(i);
  }

  return (
    <div className="mt-10">
      <h2 className="mb-10 text-3xl uppercase text-darkBlue">
        Overall ranking
      </h2>
      <h2 className="text-3xl uppercase text-darkBlue">Live ranking</h2>
      {choices.map((choice) => (
        <RankingByChoice
          key={choice}
          candidates={candidates}
          votesByChoice={votesByChoice}
          choice={choice}
        />
      ))}
    </div>
  );
}

interface VotesByChoice {
  [address: string]: {
    [choice: number]: number;
  };
}
