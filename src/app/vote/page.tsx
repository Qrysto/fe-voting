import Steps from './Steps';
import { Candidate } from '@/data';

export default async function VotePage() {
  let allCandidates = null;
  const res = await fetch('http://node5.nexus.io:7080/assets/list/accounts', {
    next: { revalidate: 60, tags: ['allCandidates'] },
  });
  if (!res.ok) {
    console.error('assets/list/accounts', res.status, res.body);
    const err = await res.json();
    throw err;
  }

  const result = await res.json();
  allCandidates = result?.result?.filter((c: Candidate) => c.active);

  return <Steps allCandidates={allCandidates} />;
}
