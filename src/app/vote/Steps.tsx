'use client';

import { useEffect, useState } from 'react';
import EnterPhone from './EnterPhone';
import ConfirmCode from './ConfirmCode';
import CastVote from './CastVote';
import { useStep, useStore } from '@/store';
import { Candidate } from '@/types';
import { jwtKey } from '@/constants';

let jwtToken: string | null = null;
if (typeof localStorage === 'object') {
  jwtToken = localStorage.getItem(jwtKey);
}

export default function Steps({
  allCandidates,
}: {
  allCandidates: Candidate[];
}) {
  const loadCandidates = useStore((state) => state.loadCandidates);
  const checkJWT = useStore((state) => state.checkJWT);
  const [checkingJWT, setChecking] = useState(!!jwtToken);
  useEffect(() => {
    loadCandidates(allCandidates);
    if (jwtToken) {
      checkJWT(jwtToken).finally(() => {
        setChecking(false);
      });
    }
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
