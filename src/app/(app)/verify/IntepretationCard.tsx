import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UList,
  UListItem,
  InlineCode,
  BlockCode,
  ExternalLink,
} from '@/components/ui/typo';

const txShape = `{
  txid: string;
  contracts: {
    to: string;
    amount: number;
    reference: number;
  }
}`;

export default function IntepretationCard({
  maxChoices,
}: {
  maxChoices: number;
}) {
  return (
    <Card id="intepretation" className="mt-6">
      <CardHeader>
        <CardTitle>How to intepret transactions data</CardTitle>
        <CardDescription>
          Votes are stored on the Nexus blockchain as transactions of tokens
          that are uniquely generated for each poll. The structure of a
          transaction is as follows:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <code className="my-2 block whitespace-pre rounded-sm bg-accent px-4 py-2 text-accent-foreground">
          {txShape}
        </code>

        <p></p>
        <UList>
          <UListItem>
            <InlineCode>txid</InlineCode>: The transaction&apos;s unique
            identifier in Nexus blockchain. You can use{' '}
            <InlineCode>txid</InlineCode> to look up the transaction details on{' '}
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
            <InlineCode>contracts.to</InlineCode>: The candidate&apos;s register
            address on Nexus blockchain. You can use it to look up the
            candidate&apos;s details on{' '}
            <ExternalLink href="https://explorer.nexus.io/">
              Nexus Explorer
            </ExternalLink>{' '}
            or check locally with the following command:
            <BlockCode content="assets/get/account address=<register_address>" />
            Replace <InlineCode>&lt;register_address&gt;</InlineCode> with the
            value from <InlineCode>contracts.to</InlineCode>.
          </UListItem>
          <UListItem>
            <InlineCode>contracts.amount</InlineCode>: Represents the preference
            order of the candidate in your vote. If{' '}
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
