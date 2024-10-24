'use client';

import { formatDistanceToNow } from 'date-fns';
import { useUpdatedNow } from '@/lib/client';

export default function UpdatedTime({ timeStamp }: { timeStamp: number }) {
  useUpdatedNow(10000);

  return (
    <>
      <div className="mt-2 font-bold">
        Updated{' '}
        {formatDistanceToNow(timeStamp, {
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
