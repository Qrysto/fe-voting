'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const updateQueryString = useCallback(
    (name: string, value: any) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        Number.isNaN(value)
      ) {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }

      return params.toString();
    },
    [searchParams]
  );

  const updateSearchParams = (name: string, value: any) => {
    const queryString = updateQueryString(name, value);
    router.push(pathname + (queryString ? `?${queryString}` : ''));
  };

  return [searchParams, updateSearchParams] as const;
}

export function useUpdatedNow(every: number, until?: number) {
  const [now, setNow] = useState(Date.now);

  // Refreshes the component every 'every' ms or until the 'until' timestamp is reached
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined = undefined;
    const refresh = () => {
      const now = Date.now();
      // Set a state to manually rerender the component
      setNow(now);

      if (until && now > until) return;
      const ms = until ? Math.min(until - now, every) : every;
      timerId = setTimeout(refresh, ms);
    };
    refresh();
    return () => clearTimeout(timerId);
  }, []);

  return now;
}
