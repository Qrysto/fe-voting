'use client';

import { formatDistanceToNow } from 'date-fns';
import { useUpdatedNow } from '@/lib/client';

export default function EndingTime({ endTime }: { endTime: number }) {
  const now = useUpdatedNow(60000, endTime);
  const pollEnded = now > endTime;

  return (
    <div className="mt-1">
      {pollEnded ? (
        'This poll has ended'
      ) : (
        <span>This poll will end in {formatDistanceToNow(endTime, {})}</span>
      )}
    </div>
  );
}
