'use client';

import { ReactNode, ComponentPropsWithoutRef, useState } from 'react';
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
import { toast } from '@/lib/useToast';
import allPolls from '@/constants/allPolls';
import { ExternalLinkIcon, Copy } from 'lucide-react';
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
            <div className="text-destructive mt-2">
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

function LocalTab({
  poll: { countryCode, ticker, pollId, maxChoices },
}: {
  poll: any;
}) {
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
                <ExternalLink href="https://en.wikipedia.org/wiki/JSON">
                  JSON format
                </ExternalLink>
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
              <ExternalLinkIcon className="h-4 w-4" />
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
            for it to finish. The bootstrap process usually takes 1-3 hours
            depending on your internet speed.
          </p>
          <p className="mt-4">
            <strong>Step 5:</strong> After the recent database bootstrap process
            completes, click <Emphasize>Console</Emphasize> icon in the bottom
            navigation bar. Here under the <Emphasize>Nexus API</Emphasize> tab,
            you can run commands and query data from Nexus blockchain as guided
            below.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify your vote</CardTitle>
          <CardDescription>
            Check if your vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Step 1:</strong> Under{' '}
            <Emphasize>Console/Nexus API</Emphasize>, enter the following
            command into the command input (CLI syntax):
            <BlockCode
              content={`finance/transactions/token/txid,contracts.reference,contracts.amount,contracts.to.address ticker=${ticker} limit=1 where=results.contracts.OP=DEBIT AND results.contracts.reference=checksum(\`<your_phone_number>\`);`}
            />
            replacing <InlineCode>&lt;your_phone_number&gt;</InlineCode> with
            the phone number you used to vote (
            {countryCode === false ? 'without' : 'with'} the &quot;+1&quot;
            country code
            {countryCode === false ? '' : ', e.g. +11234567890'}). The
            transaction data containing your vote will be printed to the output
            box in JSON format.
          </p>
          <p className="mt-4">
            <strong>Step 2:</strong> Check if the data matches the vote you've
            submitted. Read more on{' '}
            <ExternalLink href="#intepretation" target="_self">
              How to intepret transactions data
            </ExternalLink>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify the entire poll result</CardTitle>
          <CardDescription>
            Fetch all votes and re-calculate the poll result yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Step 1:</strong> Under{' '}
            <Emphasize>Console/Nexus API</Emphasize>, enter the following
            command into the command input (CLI syntax):
            <BlockCode content="ledger/list/transactions/txid,contracts.reference,contracts.amount,contracts.to.address ticker=${ticker} limit=100 page=1 where=results.contracts.OP=DEBIT" />
            The first page of transactions data (max. 100 transactions) will be
            printed to the output box in JSON format. Save this data somewhere
            to process later on.
          </p>
          <p className="mt-4">
            <strong>Step 2:</strong> Repeat step 1, replacing{' '}
            <InlineCode>page=1</InlineCode> with{' '}
            <InlineCode>page=&lt;increment_number&gt;</InlineCode> until there
            are less than 100 transactions returned (indicating the last page).
          </p>
          <p className="mt-4">
            <strong>Step 3:</strong> Use any tool to calculate the poll result
            from the transactions data. Read more on{' '}
            <ExternalLink href="#intepretation" target="_self">
              How to intepret transactions data
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink href="https://fairvote.org/our-reforms/ranked-choice-voting/">
              How Ranked Choice Voting results are calculated
            </ExternalLink>
            .
          </p>
        </CardContent>
      </Card>

      <IntepretationCard maxChoices={maxChoices} />
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
function IntepretationCard({ maxChoices }: { maxChoices: number }) {
  return (
    <Card id="intepretation">
      <CardHeader>
        <CardTitle>How to intepret transactions data</CardTitle>
        <CardDescription>
          If you follow the instructions above exactly, you will get transaction
          outputs in the following shape:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <code className="bg-accent text-accent-foreground my-2 block whitespace-pre rounded-l-sm px-4 py-2">
          {txShape}
        </code>

        <p></p>
        <UList>
          <UListItem>
            <InlineCode>txid</InlineCode>: transaction's unique identifier in
            Nexus blockchain. You can use <InlineCode>txid</InlineCode> to look
            up the transaction details on{' '}
            <ExternalLink href="https://explorer.nexus.io/">
              Nexus Explorer
            </ExternalLink>
            .
          </UListItem>
          <UListItem>
            <InlineCode>contracts</InlineCode>: With Ranked Choice Voting, your
            vote can consist of multiple candidates. Each object in{' '}
            <InlineCode>contracts</InlineCode> array represents one of the
            candidates you voted for.
          </UListItem>
          <UListItem>
            <InlineCode>contracts.to</InlineCode>: candidate's register address
            on Nexus blockchain. You can use it to lookup candidate's details
            with the following command:
            <BlockCode content="assets/get/account address=<register_address>" />
            replacing <InlineCode>&lt;register_address&gt;</InlineCode> with the
            value from <InlineCode>contracts.to</InlineCode>.
          </UListItem>
          <UListItem>
            <InlineCode>contracts.amount</InlineCode>: represents the order of
            preference of the candidate in your vote. If{' '}
            <InlineCode>amount</InlineCode> equals {maxChoices}, it's your most
            preferred candidate. If <InlineCode>amount</InlineCode> equals{' '}
            {maxChoices - 1}, it's your second most preferred candidate, and so
            on...
          </UListItem>
          <UListItem>
            <InlineCode>contracts.reference</InlineCode>: checksum of your phone
            number. One Nexus transaction can contain multiple votes from
            different voters due to batching mechanism to improve system
            performance, so <InlineCode>reference</InlineCode> can be used to
            distinguish votes from different voters.
          </UListItem>
        </UList>
      </CardContent>
    </Card>
  );
}

function UList({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
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
}: ComponentPropsWithoutRef<'li'>) {
  return (
    <li {...props} className={cn('list-inside', className)}>
      <span className="ml-[-10px]">{children}</span>
    </li>
  );
}

function Emphasize({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('font-semibold', className)} {...props} />;
}

function InlineCode({ className, ...props }: ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      className={cn(
        'bg-accent text-accent-foreground inline-block rounded-sm px-1',
        className
      )}
      {...props}
    />
  );
}

function BlockCode({
  className,
  content,
  ...props
}: ComponentPropsWithoutRef<'code'> & { content: string }) {
  return (
    <div className={cn('my-2 flex items-stretch', className)} {...props}>
      <ScrollArea className="bg-accent text-accent-foreground flex-1 rounded-l-sm">
        <code className="block whitespace-nowrap px-4 py-3">{content}</code>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <button
        className="bg-accent text-accent-foreground hover:bg-accent/80 flex flex-shrink-0 items-center rounded-r-sm border-l border-lightGray/50 px-4 transition-colors"
        onClick={() => {
          if (!navigator?.clipboard) return;
          navigator.clipboard.writeText(content);
          toast({
            title: 'Copied!',
            description: 'The code has been copied to the clipboard.',
          });
        }}
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

function ExternalLink({
  className,
  href,
  target = '_blank',
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href={href}
      target={target}
      className={cn('text-blue underline underline-offset-1', className)}
      {...props}
    />
  );
}
