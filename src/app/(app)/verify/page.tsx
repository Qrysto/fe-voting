import allPolls from '@/constants/allPolls';
import * as activePoll from '@/constants/activePoll';
import OnlineTab from './OnlineTab';
import LocalTab from './LocalTab';
import IntepretationCard from './IntepretationCard';

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
