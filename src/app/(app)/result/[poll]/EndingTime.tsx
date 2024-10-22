'use client';

import { formatDistanceToNow } from 'date-fns';

export default function EndingTime({ endTime }: { endTime: number }) {
  const pollEnded = Date.now() > endTime;

  return (
    <div className="mt-1">
      {pollEnded ? (
        'This poll has ended'
      ) : (
        <span>
          This poll will end in
          {formatDistanceToNow(endTime, { includeSeconds: true })}
        </span>
      )}
    </div>
  );
}
