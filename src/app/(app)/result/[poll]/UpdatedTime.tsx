'use client';

import { formatDistanceToNow } from 'date-fns';

export default function UpdatedTime({ timeStamp }: { timeStamp: number }) {
  return (
    <>
      <div className="mt-2 font-bold">
        Updated{' '}
        {formatDistanceToNow(timeStamp, {
          includeSeconds: true,
          addSuffix: true,
        })}
        .
      </div>
      <div className="mt-1">
        Poll result will be automatically re-calculated every few minutes.
      </div>
    </>
  );
}
