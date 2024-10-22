'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function EndingTime({ endTime }: { endTime: number }) {
  const pollEnded = Date.now() > endTime;

  // Refreshes the component every minute or until the endTime is reached
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined = undefined;
    const refresh = () => {
      const now = Date.now();
      // Set a state to manually rerender the component
      setNow(now);

      if (now > endTime) return;
      const ms = Math.min(endTime - now, 60000);
      timerId = setTimeout(refresh, ms);
    };
    refresh();
    return () => clearTimeout(timerId);
  }, []);

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
