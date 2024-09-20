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
import allPolls from '@/constants/allPolls';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as activePoll from '@/constants/activePoll';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('poll');
  const poll = (pollId && allPolls[pollId]) || activePoll;

  return (
    <main>
      <OnlineTab poll={poll} />
      <LocalTab />
    </main>
  );
}

function OnlineTab({ poll: { callNexus, token, pollId } }: { poll: any }) {
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

function LocalTab() {
  return (
    <TabsContent value="local" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup instructions</CardTitle>
          <CardDescription>
            <strong>Prerequisites:</strong> In order to locally verify votes on
            the Nexus blockchain, you will need{' '}
            <Emphasize>
              a computer with Windows, MacOS, or Linux operating system
            </Emphasize>
            . Additionally, to verify the entire poll result, you also need
            basic data processing skills, including JSON data handling, to
            process and analyze the large volume of votes.
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
              Click <Emphasize>Settings</Emphasize> in the bottom icon bar.
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
          <CardDescription>Follow the instructions below.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup instructions</CardTitle>
          <CardDescription>
            Follow the instructions below to See if your vote has been recorded
            correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </TabsContent>
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

function OList({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={cn('my-2 list-inside list-decimal space-y-2 pl-3', className)}
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

function OListItem({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props} className={cn('list-inside', className)}>
      <span className="">{children}</span>
    </li>
  );
}

function Emphasize({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <span className={cn('font-semibold', className)} {...props} />;
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
