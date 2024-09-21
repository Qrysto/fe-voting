'use client';

import { HTMLAttributes, useState } from 'react';
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
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/lib/useToast';
import allPolls from '@/constants/allPolls';
import { ExternalLink, Copy } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import * as activePoll from '@/constants/activePoll';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('poll');
  const poll = (pollId && allPolls[pollId]) || activePoll;

  return (
    <main>
      <OnlineTab poll={poll} />
      <LocalTab poll={poll} />
    </main>
  );
}

function OnlineTab({ poll: { pollId } }: { poll: any }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fetching, setFetching] = useState(false);
  // undefined = initial state
  // null = transaction not found
  const [transaction, setTransaction] = useState<object | null | undefined>(
    undefined
  );
  const findVote = async (phoneNumber: string) => {
    setFetching(true);
    try {
      const { data } = await axios.get(
        `/api/vote?poll=${pollId}&phone=${phoneNumber}`
      );
      setTransaction(data.transaction || null);
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
        <CardContent className="mb-2 space-y-2">
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
          {transaction === null && (
            <div className="mt-2 text-destructive">
              Cannot find any vote associated to this phone number! Please make
              sure you selected the right poll and entered the exact phone
              number that you used to vote on this poll.
            </div>
          )}
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

function LocalTab({ poll: { countryCode, ticker, pollId } }: { poll: any }) {
  const { toast } = useToast();
  const verifyVoteCode = `finance/transactions/token/txid,contracts.reference,contracts.amount,contracts.to.address ticker=${ticker} limit=1 where=results.contracts.OP=DEBIT AND results.contracts.reference=checksum(\`<your_phone_number>\`);`;
  console.log(pollId, countryCode);

  return (
    <TabsContent value="local" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup instructions</CardTitle>
          <CardDescription>
            <strong>Prerequisites:</strong> In order to locally verify votes on
            the Nexus blockchain, you will need{' '}
            <UList>
              <UListItem>
                A computer with Windows, MacOS, or Linux operating system .
              </UListItem>
              <UListItem>
                Basic knowledge about how to read data in{' '}
                <a
                  href="https://en.wikipedia.org/wiki/JSON"
                  target="_blank"
                  className="text-blue underline underline-offset-1"
                >
                  JSON format
                </a>
                .
              </UListItem>
              <UListItem>
                If you want to verify the entire poll result, you will also need
                some basic data processing skills, including JSON data handling,
                in order to process the large volume of votes.
              </UListItem>
            </UList>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Step 1:</strong> Download and install the latest Nexus
            Wallet desktop app on your computer.
          </p>
          <BigButton
            href="https://nexus.io/wallet"
            target="_blank"
            primary
            className="mt-2"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Nexus Wallet download page</span>
              <ExternalLink className="h-4 w-4" />
            </span>
          </BigButton>
          <p className="mt-4">
            <strong>Step 2:</strong> Run Nexus Wallet and go through the
            onboarding screens
          </p>
          <UList>
            <UListItem>
              Select your preferred language. <Emphasize>English</Emphasize> is
              recommended, other languages are contributed by the community and
              might be inaccurate or not fully translated.
            </UListItem>
            <UListItem>
              Accept the <Emphasize>License Agreement</Emphasize>.
            </UListItem>
            <UListItem>
              You can skip the <Emphasize>Create New User</Emphasize> dialog.
            </UListItem>
          </UList>
          <p className="mt-4">
            <strong>Step 3:</strong> Turn off Lite mode by doing the following
            steps.
          </p>
          <UList>
            <UListItem>
              Click <Emphasize>Settings</Emphasize> icon in the bottom
              navigation bar.
            </UListItem>
            <UListItem>
              Go to the <Emphasize>Core</Emphasize> tab.
            </UListItem>
            <UListItem>
              Disable <Emphasize>Lite mode</Emphasize>.
            </UListItem>
            <UListItem>
              Click <Emphasize>Save settings</Emphasize>.
            </UListItem>
          </UList>
          <p className="mt-4">
            <strong>Step 4:</strong> When the{' '}
            <Emphasize>Download recent database?</Emphasize> dialog pops up,
            click <Emphasize>Yes, let&#39;s bootstrap it</Emphasize> and wait
            for it to finish.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify your vote</CardTitle>
          <CardDescription>
            After finishing the setup steps, here's how you can check if your
            vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Step 1:</strong> Click <Emphasize>Console</Emphasize> icon
            in the bottom navigation bar.
          </p>
          <p className="mt-4">
            <strong>Step 2:</strong> In <Emphasize>Nexus API</Emphasize> tab,
            enter the following command:
            <div className="my-2 flex items-stretch ">
              <ScrollArea className="flex-1 rounded-l-sm bg-accent text-accent-foreground">
                <code className="block whitespace-nowrap px-4 py-3">
                  {verifyVoteCode}
                </code>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <button
                className="flex flex-shrink-0 items-center rounded-r-sm border-l border-lightGray/50 bg-accent px-4 text-accent-foreground transition-colors hover:bg-accent/80"
                onClick={() => {
                  if (!navigator?.clipboard) return;
                  navigator.clipboard.writeText(verifyVoteCode);
                  toast({
                    title: 'Copied!',
                    description: 'The code has been copied to the clipboard.',
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            replacing <InlineCode>&lt;your_phone_number&gt;</InlineCode> with
            the phone number you used to vote (
            {countryCode === false ? 'without' : 'with'} the &quot;+1&quot;
            country code
            {countryCode === false ? '' : ', e.g. +11234567890'}).
          </p>
          <p className="mt-4">
            <strong>Step 3:</strong> The transaction data containing your vote
            will be printed to the output box in JSON format. Here you would
            want to pay attention to the `contracts.to` and `contracts.amount`
            fields.
            <UList>
              <UListItem></UListItem>
            </UList>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify the entire poll result</CardTitle>
          <CardDescription>
            Follow the instructions below to See if your vote has been recorded
            correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <IntepretationCard />
    </TabsContent>
  );
}

const txShape = `{
  txid: string;
  contracts: {
    to: string;
    amount: number;
    reference: number;
  }
}`;
function IntepretationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to intepret transaction data</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          If you follow the instructions above exactly, the transaction output
          you get will be in the following shape:
        </p>
        <code className="my-2 block rounded-l-sm bg-accent px-4 py-2 text-accent-foreground">
          {txShape}
        </code>
        <p>
          <InlineCode>txid</InlineCode> is the transaction's unique identifier
          in Nexus blockchain. You can use this to look up the transaction on{' '}
          <a href="https://explorer.nexus.io/" target="_blank">
            Nexus Explorer
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}

function UList({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={cn('my-2 list-inside list-disc space-y-2 pl-3', className)}
    />
  );
}

function UListItem({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props} className={cn('list-inside', className)}>
      <span className="ml-[-10px]">{children}</span>
    </li>
  );
}

function Emphasize({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <span className={cn('font-semibold', className)} {...props} />;
}

function InlineCode({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <code
      className={cn(
        'inline-block rounded-sm bg-accent text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

function ExternalLink({
  className,
  href,
  target,
  ...props
}: HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="https://en.wikipedia.org/wiki/JSON"
      target="_blank"
      className="text-blue underline underline-offset-1"
    />
  );
}

/*
Prerequisites: In order to verify the votes on Nexus blockchain locally, you need a desktop or laptop computer running either Windows, MacOS, or Linux.
If you want to verify the whole poll's result, you also need some basic data processing skill (in JSON format) to calculate the poll's result from a large amount of votes.

Step 1: Download and install the latest Nexus Wallet desktop app.

Step 2: Run Nexus Wallet and go through the onboarding screens

Step 3: Don't choose lite mode, and choose bootstrap the database.

Verify your vote:
Go to Terminal tab, type the command

Verify all votes:
Step 4: Go to Terminal tab, type the command. Save the results somewhere

Step 5: Repeat step 4 for as many pages as needed.
*/
