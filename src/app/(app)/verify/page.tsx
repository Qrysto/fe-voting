import type { Metadata } from 'next';
import allPolls from '@/constants/allPolls';
import * as activePoll from '@/constants/activePoll';
import OnlineTab from './OnlineTab';
import LocalTab from './LocalTab';
import IntepretationCard from './IntepretationCard';

export async function generateMetadata({
  params: { poll },
}: {
  params: { poll: string };
}): Promise<Metadata> {
  return {
    title: 'Verify | Free And Equal',
    description:
      'Look up your vote and verify the results of the poll! Powered by nexus.io.',
    openGraph: {
      title: 'Verify | Free And Equal',
      description:
        'Look up your vote and verify the results of the poll! Powered by nexus.io.',
      url: `https://vote.freeandequal.org/verify/${poll}`,
      type: 'website',
      siteName: 'Free And Equal Voting App',
    },
  };
}

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const pollId = searchParams?.poll;
  const poll = (typeof pollId === 'string' && allPolls[pollId]) || activePoll;

  return (
    <main>
      <OnlineTab pollId={poll.pollId} />
      <LocalTab poll={poll} />
      <IntepretationCard maxChoices={poll.maxChoices} />
    </main>
  );
}
