'use client';

import EnterPhone from './EnterPhone';
import ConfirmCode from './ConfirmCode';
import CastVote from './CastVote';
import { useStep } from '@/store';

export default function VotePage() {
  const step = useStep();

  if (step === 3) {
    return <CastVote />;
  } else if (step === 2) {
    return <ConfirmCode />;
  } else {
    return <EnterPhone />;
  }
}
