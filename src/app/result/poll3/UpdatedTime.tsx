'use client';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';

TimeAgo.addDefaultLocale(en);

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
