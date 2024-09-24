'use client';

import { useState } from 'react';
import axios from 'axios';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BigButton from '@/components/BigButton';
import Spinner from '@/components/Spinner';
import CandidateImage from '@/components/CandidateImage';
import { ExternalLink } from '@/components/ui/typo';
import { ExternalLinkIcon } from 'lucide-react';
import { oswald } from '@/fonts';
import { partyColor } from '@/lib/utils';

export default function OnlineTab({ pollId }: { pollId: string }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fetching, setFetching] = useState(false);
  // undefined = initial state
  // null = transaction not found
  const [vote, setVote] = useState<any | null | undefined>(undefined);
  const findVote = async (phoneNumber: string) => {
    setFetching(true);
    try {
      const { data } = await axios.get(
        `/api/vote?poll=${pollId}&phone=${phoneNumber}`
      );
      setVote(data.vote || null);
    } catch (err: any) {
      console.log(err);
      alert(
        'ERROR! ' + err?.response.data?.message ||
          err?.message ||
          'Unknown error'
      );
    } finally {
      setFetching(false);
    }
  };

  return (
    <TabsContent value="online" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify your vote</CardTitle>
          <CardDescription>
            See if your vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-2 space-y-4">
          <form
            id="find-vote"
            className="space-y-1"
            onSubmit={(evt) => {
              evt.preventDefault();
              findVote(phoneNumber);
            }}
          >
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(evt) => {
                setPhoneNumber(evt.target.value);
              }}
              placeholder="Enter your phone number"
              required
            />
          </form>
          {vote === null && (
            <div className="mt-2 text-destructive">
              Could not find any vote associated to this phone number! Please
              make sure you selected the right poll and entered the exact phone
              number that you used to vote on this poll.
            </div>
          )}
          {!!vote && <Vote vote={vote} />}
        </CardContent>
        <CardFooter>
          <BigButton primary disabled={fetching} type="submit" form="find-vote">
            {fetching && <Spinner inverse className="mr-2 inline-block" />}
            Find your vote
          </BigButton>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify poll result</CardTitle>
          <CardDescription>
            See if poll result have been calculated correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2"></CardContent>
      </Card>
    </TabsContent>
  );
}

function Vote({ vote }: { vote: any }) {
  return (
    <div className="rounded-md border border-input bg-background shadow-none">
      <div className="px-4 pt-3">
        <h3 className="mb-2 text-2xl">Your vote</h3>
        <div>
          <ExternalLink
            href={`https://explorer.nexus.io/scan/${vote.txid}`}
            className="flex items-center space-x-1 text-sm"
          >
            <span>Check on explorer.nexus.io</span>
            <ExternalLinkIcon className="h-4 w-4" />
          </ExternalLink>
        </div>
      </div>
      <div className="px-4 py-3">
        {vote.choices.map((candidate: any, i: number) => (
          <VotedCandidate
            key={candidate.address}
            candidate={candidate}
            rank={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

function VotedCandidate({ candidate, rank }: { candidate: any; rank: number }) {
  if (!candidate) return null;
  const superscript =
    rank === 1 ? 'ST' : rank === 2 ? 'ND' : rank === 3 ? 'RD' : 'TH';

  return (
    <li className="flex items-center py-[10px]">
      <div
        className={`relative mr-3 h-[45px] w-[45px] shrink-0 grow-0 rounded-full bg-lighterGreen pr-1 text-center text-[25px] font-semibold leading-[45px] text-green ${oswald.className}`}
      >
        <span>{rank}</span>
        <span className="absolute top-[-5px] text-[10px]">{superscript}</span>
      </div>
      <CandidateImage candidate={candidate} className="shrink-0 grow-0" />
      <div className="shrink grow px-4">
        <div className="text-[17px] font-bold text-darkBlue">
          {`${candidate.First} ${candidate.Last}`}
        </div>
        <div
          className={`space-x-3 text-[11px] font-bold uppercase ${oswald.className}`}
        >
          <span className={partyColor(candidate.Party)}>{candidate.Party}</span>
          {candidate.Website === 'NONE' ? (
            <span className="text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="text-blue underline underline-offset-2"
            >
              Website
            </a>
          )}
          <ExternalLink
            href={`https://explorer.nexus.io/scan/${candidate.address}`}
            target="_blank"
            className="space-x-1"
          >
            <span>Check</span>
          </ExternalLink>
        </div>
      </div>
    </li>
  );
}
