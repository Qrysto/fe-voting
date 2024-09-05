'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import allPolls from '@/constants/allPolls';

const reversedList = Object.entries(allPolls).reverse();
export default function ResultLinks() {
  return (
    <div>
      {reversedList.map(([pollId, { pollName, pollTime }]) => (
        <ResultLink key={pollId} id={pollId} title={pollName} date={pollTime} />
      ))}
    </div>
  );
}

function ResultLink({
  id,
  title,
  date,
}: {
  id: string;
  title: ReactNode;
  date: ReactNode;
}) {
  const pathname = usePathname();
  const href = `/result/${id}`;

  return (
    <Link
      href={href}
      className={cn(
        'block cursor-pointer px-6 py-3 hover:bg-lightGray',
        pathname === href && 'bg-lightBlue hover:bg-lightBlue'
      )}
    >
      <div className="text-sm opacity-75">{date}</div>
      <h3 className="text-xl text-darkBlue">{title}</h3>
    </Link>
  );
}
