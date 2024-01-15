'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Candidate } from '@/types';
import defaultAvatar from '@/default-avatar.jpg';

export default function CandidateImage({
  candidate,
  className,
}: {
  candidate: Candidate;
  className: string;
}) {
  const [error, setError] = useState(false);
  const src = `/candidates/${`${candidate.First} ${candidate.Last}`
    .toUpperCase()
    .replaceAll(' ', '_')}.jpg`;

  return (
    <Image
      width={40}
      height={40}
      alt={`${candidate.First} ${candidate.Last}`}
      className={'rounded-md ' + className}
      src={error ? defaultAvatar : src}
      onError={() => {
        setError(true);
      }}
    />
  );
}
