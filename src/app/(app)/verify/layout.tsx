'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateSearchParams } from '@/lib/client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ExternalLink } from '@/components/ui/typo';
import allPolls from '@/constants/allPolls';
import * as activePoll from '@/constants/activePoll';

const verifiablePolls = Object.values(allPolls)
  .filter((poll: any) => poll.verifiable !== false)
  .reverse();

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const tab = searchParams.get('tab');

  return (
    <div className="py-6">
      <h1 className="mb-4 text-4xl">Verify</h1>
      <p className="mb-4">
        Free and Equal Voting app is powered by{' '}
        <ExternalLink href="https://nexus.io/">Nexus blockchain</ExternalLink>,
        meaning your votes are all kept on the blockchain for immutability and
        verifiability.
      </p>

      <div className="mb-2">
        <Label>Select the poll you want to verify</Label>
      </div>
      <PollSelect />

      <Tabs
        value={tab === 'local' ? 'local' : 'online'}
        onValueChange={(val) => {
          updateSearchParams('tab', val);
        }}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="online">Verify online</TabsTrigger>
          <TabsTrigger value="local">Verify locally</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}

function PollSelect() {
  const [open, setOpen] = useState(false);
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const pollId = searchParams.get('poll');
  const poll = (pollId && allPolls[pollId]) || activePoll;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="flex cursor-pointer items-center rounded-md border border-border bg-popover px-3 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-popover/70 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <div className="flex-1">
            <div className="text-sm opacity-75">{poll.pollTime}</div>
            <h3 className="text-xl text-darkBlue">{poll.pollName}</h3>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60%] after:hidden">
        <div className="container flex min-h-0 flex-1 flex-col md:max-w-3xl">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle className="text-3xl uppercase text-darkBlue">
              Poll results
            </DrawerTitle>
          </DrawerHeader>
          <div className="mx-[-1.5rem] flex-1 overflow-auto pb-6">
            {verifiablePolls.map(({ pollId, pollName, pollTime }: any) => (
              <div
                key={pollId}
                className="block cursor-pointer px-6 py-3 hover:bg-lightGray"
                onClick={() => {
                  updateSearchParams('poll', pollId);
                  setOpen(false);
                }}
              >
                <div className="text-sm opacity-75">{pollTime}</div>
                <h3 className="text-xl text-darkBlue">{pollName}</h3>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
