import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BigButton from '@/components/BigButton';
import { ExternalLinkIcon } from 'lucide-react';
import {
  UList,
  UListItem,
  Emphasize,
  InlineCode,
  BlockCode,
  ExternalLink,
} from '@/components/ui/typo';

export default function LocalTab({
  poll: { countryCode, ticker, maxChoices },
}: {
  poll: any;
}) {
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
            <strong>Step 2:</strong> Check if the data matches the vote
            you&apos;ve submitted. Read more on{' '}
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
        <code className="my-2 block whitespace-pre rounded-sm bg-accent px-4 py-2 text-accent-foreground">
          {txShape}
        </code>

        <p></p>
        <UList>
          <UListItem>
            <InlineCode>txid</InlineCode>: transaction&apos;s unique identifier
            in Nexus blockchain. You can use <InlineCode>txid</InlineCode> to
            look up the transaction details on{' '}
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
            <InlineCode>contracts.to</InlineCode>: candidate&apos;s register
            address on Nexus blockchain. You can use it to lookup
            candidate&apos;s details with the following command:
            <BlockCode content="assets/get/account address=<register_address>" />
            replacing <InlineCode>&lt;register_address&gt;</InlineCode> with the
            value from <InlineCode>contracts.to</InlineCode>.
          </UListItem>
          <UListItem>
            <InlineCode>contracts.amount</InlineCode>: represents the order of
            preference of the candidate in your vote. If{' '}
            <InlineCode>amount</InlineCode> equals {maxChoices}, it&apos;s your
            most preferred candidate. If <InlineCode>amount</InlineCode> equals{' '}
            {maxChoices - 1}, it&apos;s your second most preferred candidate,
            and so on...
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
