'use client';

import { ReactTimeAgo } from '@/lib/timeAgo';

export default function EndingTime({ endTime }: { endTime: number }) {
  const pollEnded = Date.now() > endTime;

  return (
    <div className="mt-1">
      {pollEnded ? (
        'This poll has ended'
      ) : (
        <ReactTimeAgo date={endTime} locale="en-US" />
      )}
    </div>
  );
}
