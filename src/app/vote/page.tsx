import Steps from './Steps';
import { Candidate } from '@/data';

export default async function VotePage() {
  const res = await fetch('http://node5.nexus.io:7080/assets/list/accounts', {
    next: { revalidate: 60, tags: ['allCandidates'] },
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
    },
  });
  if (!res.ok) {
    console.error('assets/list/accounts', res.status, res.body);
    const err = await res.json();
    throw err;
  }

  const result = await res.json();
  const allCandidates = result?.result?.filter((c: Candidate) => c.active);

  return <Steps allCandidates={allCandidates} />;
}
