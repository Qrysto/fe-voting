import { ReadonlyURLSearchParams } from 'next/navigation';
import allPolls from '@/constants/allPolls';
import * as activePoll from '@/constants/activePoll';
import OnlineTab from './OnlineTab';
import LocalTab from './LocalTab';

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
    </main>
  );
}
