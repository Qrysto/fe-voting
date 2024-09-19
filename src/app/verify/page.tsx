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
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  return (
    <main>
      <OnlineTab />
      <LocalTab />
    </main>
  );
}

function OnlineTab() {
  return (
    <TabsContent value="online">
      <Card>
        <CardHeader>
          <CardTitle>Verify your vote online</CardTitle>
          <CardDescription>
            See if your vote has been recorded correctly on Nexus blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Phone number</Label>
            <Input
              id="phone"
              placeholder="Enter the phone number you used to vote"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Find your vote</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify all votes online</CardTitle>
          <CardDescription>
            See if all votes have been counted correctly on Nexus blockchain.
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
