'use client';

import EnterPhone from './EnterPhone';
import ConfirmCode from './ConfirmCode';
import { useStep } from '@/store';

export default function VotePage() {
  const step = useStep();

  if (step === 1) {
    return <EnterPhone />;
  } else if (step === 2) {
    return <ConfirmCode />;
  }
}
