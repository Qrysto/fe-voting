'use client';

import ReactTimeAgo from 'react-time-ago';
import { endTime } from '@/constants';

export default function EndingTime() {
  const pollEnded = Date.now() > endTime;

  return (
    <div className="mt-1">
      {pollEnded ? (
        'This poll has ended'
      ) : (
        <span>
          Ending <ReactTimeAgo date={endTime} locale="en-US" />.
        </span>
      )}
    </div>
  );
}
