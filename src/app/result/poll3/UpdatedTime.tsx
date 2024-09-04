'use client';

import { ReactTimeAgo } from '@/app/lib/timeAgo';

export default function UpdatedTime({ timeStamp }: { timeStamp: number }) {
  return (
    <>
      <div className="mt-2 font-bold">
        Updated <ReactTimeAgo date={timeStamp} locale="en-US" />.
      </div>
      <div className="mt-1">
        Poll result will be automatically re-calculated every few minutes.
      </div>
    </>
  );
}
