'use client';

import { useEffect } from 'react';
import EnterPhone from './EnterPhone';
import ConfirmCode from './ConfirmCode';
import CastVote from './CastVote';
import { useStep, useStore } from '@/store';
import { Candidate } from '@/data';

export default function Steps({
  allCandidates,
}: {
  allCandidates: Candidate[];
}) {
  const loadCandidates = useStore((state) => state.loadCandidates);
  useEffect(() => {
    loadCandidates(allCandidates);
  }, []);
  const step = useStep();

  if (step === 3) {
    return <CastVote />;
  } else if (step === 2) {
    return <ConfirmCode />;
  } else {
    return <EnterPhone />;
  }
}
