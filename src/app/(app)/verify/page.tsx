'use client';

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
import { useSearchParams } from 'next/navigation';
import allPolls from '@/constants/allPolls';
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

function OnlineTab({ poll }: { poll: any }) {
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
          <div className="space-y-1">
            <Label htmlFor="name">Phone number</Label>
            <Input
              id="phone"
              placeholder="Enter the phone number you used to vote"
            />
          </div>
        </CardContent>
        <CardFooter>
          <BigButton primary>Find your vote</BigButton>
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
    <TabsContent value="local">
      <Card>
        <CardHeader>
          <CardTitle>Verify your vote locally</CardTitle>
          <CardDescription>
            See if your vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2"></CardContent>
      </Card>
    </TabsContent>
  );
}
