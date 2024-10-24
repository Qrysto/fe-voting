'use client';

import { useState, useRef } from 'react';
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
import PhoneInput from '@/components/PhoneInput';
import BigButton from '@/components/BigButton';
import CodeInput from '@/components/CodeInput';
import LinkButton from '@/components/LinkButton';
import CandidateImage from '@/components/CandidateImage';
import { ExternalLink } from '@/components/ui/typo';
import { toast } from '@/lib/useToast';
import { ExternalLinkIcon, ArrowLeft } from 'lucide-react';
import { oswald } from '@/fonts';
import { partyColor, cn } from '@/lib/utils';
import { toE164US } from '@/lib/phone';
import { useStep, useStore } from '@/store';

export default function OnlineTab({ pollId }: { pollId: string }) {
  const step = useStep();

  return (
    <TabsContent value="online" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify your vote</CardTitle>
          <CardDescription>
            See if your vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        {step === 1 && <EnterPhone />}
        {step === 2 && <ConfirmCode />}
        {step === 3 && <FindVote pollId={pollId} />}
      </Card>
    </TabsContent>
  );
}

function EnterPhone() {
  const phoneFilled = useStore((state) =>
    state.phoneDigits.every((digit) => digit)
  );
  const phoneError = useStore((state) => state.phoneError);
  const confirmPhoneNumber = useStore((state) => state.confirmPhoneNumber);
  const confirmBtnRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);
  return (
    <>
      <CardContent>
        <h2
          className={`mb-6 mt-2 px-8 text-center text-xl uppercase ${
            phoneError ? 'text-red' : ''
          }`}
        >
          {phoneError || 'Please enter your mobile phone number below'}
        </h2>
        <PhoneInput
          focusConfirmBtn={() => {
            confirmBtnRef.current?.focus();
          }}
          fontSize={36}
        />
      </CardContent>
      <CardFooter>
        <BigButton
          primary
          disabled={!phoneFilled}
          className="mt-6 shadow-md"
          ref={confirmBtnRef}
          action={() => confirmPhoneNumber({ forVoting: false })}
        >
          Send code to me
        </BigButton>
      </CardFooter>
    </>
  );
}

function ConfirmCode() {
  const codeFilled = useStore((state) =>
    state.codeDigits.every((digit) => digit)
  );
  const phoneNumber = useStore((state) => state.phoneNumber);
  const codeError = useStore((state) => state.codeError);
  const confirmCode = useStore((state) => state.confirmCode);
  const requestCode = useStore((state) => state.requestCode);
  const resetPhoneNumber = useStore((state) => state.resetPhoneNumber);
  const confirmBtnRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);

  return (
    <>
      <CardContent>
        <h2
          className={`mb-6 mt-2 px-4 text-center text-xl uppercase ${
            codeError ? 'text-red' : ''
          }`}
        >
          {codeError || 'Please enter your verification code'}
        </h2>
        <CodeInput
          focusConfirmBtn={() => {
            confirmBtnRef.current?.focus();
          }}
          fontSize={62}
        />
        <p className="mt-8 text-center">
          We sent you a text to your phone number {toE164US(phoneNumber)}.
          Please check and enter your code to confirm your identity.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-10">
          <LinkButton onClick={resetPhoneNumber}>
            <ArrowLeft className="mr-1 inline-block h-4 w-4 align-middle" />
            <span>Back</span>
          </LinkButton>

          <LinkButton
            action={async () => {
              await requestCode(undefined, { forVoting: false });
              toast({
                title: 'Code sent!',
                description: 'A new code has been sent to your phone number!',
              });
            }}
          >
            Get a new code
          </LinkButton>
        </div>
      </CardContent>
      <CardFooter>
        <BigButton
          primary
          disabled={!codeFilled}
          className=""
          ref={confirmBtnRef}
          action={confirmCode}
        >
          Confirm code
        </BigButton>
      </CardFooter>
    </>
  );
}

function FindVote({ pollId }: { pollId: string }) {
  // undefined = initial state
  // null = transaction not found
  const [vote, setVote] = useState<any | null | undefined>(undefined);
  const phoneNumber = useStore((state) => state.phoneNumber);
  const jwtToken = useStore((state) => state.jwtToken) || '';
  const unconfirmCode = useStore((state) => state.unconfirmCode);
  const resetPhoneNumber = useStore((state) => state.resetPhoneNumber);

  const findVote = async () => {
    setVote(undefined);
    try {
      const { data } = await axios.get(
        `/api/vote?poll=${pollId}&token=${encodeURIComponent(jwtToken)}`
      );
      setVote(data.vote || null);
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'ERROR!',
        description:
          err?.response.data?.message || err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <CardContent className="mb-2 space-y-4">
        {/* <form
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
              </form> */}
        <p>
          Your phone number: <strong>{toE164US(phoneNumber)}</strong>.<br />
          <a
            href="#"
            className="underline underline-offset-2"
            onClick={(e) => {
              e.preventDefault();
              resetPhoneNumber();
              unconfirmCode();
            }}
          >
            Change phone number
          </a>
        </p>
        {vote === null && (
          <div className="mt-2 text-destructive">
            Could not find any vote associated to this phone number! Please make
            sure you selected the right poll and entered the exact phone number
            that you used to vote on this poll.
          </div>
        )}
        {!!vote && <Vote vote={vote} />}
      </CardContent>
      <CardFooter>
        <BigButton primary action={findVote}>
          Find your vote
        </BigButton>
      </CardFooter>
    </>
  );
}

function Vote({ vote }: { vote: any }) {
  const contractCount = vote.contractIds.length;
  return (
    <div className="rounded-md border border-input bg-background shadow-none">
      <div className="px-4 pt-3">
        <h3 className="mb-2 text-2xl">Your vote</h3>
        <div>
          You can{' '}
          <ExternalLink href={`https://explorer.nexus.io/scan/${vote.txid}`}>
            <span>look up your vote on Nexus Explorer</span>
          </ExternalLink>
          . Your vote was recorded in {contractCount} contract
          {contractCount > 1 ? 's' : ''} with the following ID
          {contractCount > 1 ? 's' : ''}:{' '}
          {vote.contractIds?.map((id: number, index: number) => (
            <span key={id}>
              {index !== 0 && ', '}
              <strong>{id}</strong>
            </span>
          ))}
          .
        </div>
      </div>
      <div className="px-2 py-3">
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
      <div className="shrink grow pl-4">
        <div className="text-[17px] font-bold text-darkBlue">
          {`${candidate.First} ${candidate.Last}`}
        </div>
        <div
          className={cn('text-[11px] font-bold uppercase ', oswald.className)}
        >
          <span className={cn('mb-2 mr-3', partyColor(candidate.Party))}>
            {candidate.Party}
          </span>
          {candidate.Website === 'NONE' ? (
            <span className="mb-2 mr-3 text-gray underline underline-offset-2">
              Website
            </span>
          ) : (
            <a
              href={candidate.Website}
              target="_blank"
              className="mb-2 mr-3 text-blue underline underline-offset-2"
            >
              Website
            </a>
          )}
          <ExternalLink
            href={`https://explorer.nexus.io/scan/${candidate.address}`}
            target="_blank"
            className="inline-flex items-center space-x-1"
          >
            <span>Look up</span>
            <ExternalLinkIcon className="h-4 w-4" />
          </ExternalLink>
        </div>
      </div>
    </li>
  );
}
