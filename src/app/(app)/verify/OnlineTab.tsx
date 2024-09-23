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

export default function OnlineTab({ pollId }: { pollId: string }) {
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
