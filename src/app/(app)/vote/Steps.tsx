'use client';

import { useEffect, useState } from 'react';
import EnterPhone from './EnterPhone';
import ConfirmCode from './ConfirmCode';
import CastVote from './CastVote';
import { useStep, useStore } from '@/store';
import { Candidate } from '@/types';
import { jwtKey } from '@/constants';

export default function Steps({
  allCandidates,
}: {
  allCandidates: Candidate[];
}) {
  const loadCandidates = useStore((state) => state.loadCandidates);
  const checkJWT = useStore((state) => state.checkJWT);
  const [checkingJWT, setChecking] = useState(true);
  useEffect(() => {
    loadCandidates(allCandidates);
    if (typeof localStorage === 'object') {
      const jwtToken = localStorage.getItem(jwtKey);
      if (jwtToken) {
        checkJWT(jwtToken).finally(() => {
          setChecking(false);
        });
        return;
      }
    }
    setChecking(false);
  }, []);
  const step = useStep();

  if (checkingJWT) {
    return null;
  }

  if (step === 3) {
    return <CastVote />;
  } else if (step === 2) {
    return <ConfirmCode />;
  } else {
    return <EnterPhone />;
  }
}
