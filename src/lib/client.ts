'use client';

import { useCallback } from 'react';
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
