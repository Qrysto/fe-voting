import { ReadonlyURLSearchParams } from 'next/navigation';
import allPolls from '@/constants/allPolls';
import * as activePoll from '@/constants/activePoll';
import OnlineTab from './OnlineTab';
import LocalTab from './LocalTab';

export default function VerifyPage(
  params: any,
  searchParams?: ReadonlyURLSearchParams
) {
  const pollId = searchParams?.get('poll');
  const poll = (pollId && allPolls[pollId]) || activePoll;

  return (
    <main>
      <OnlineTab pollId={poll.pollId} />
      <LocalTab poll={poll} />
    </main>
  );
}
