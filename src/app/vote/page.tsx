import EnterPhone from './EnterPhone';
import { getStep } from './voteStep';

export default function Vote() {
  const step = getStep();

  if (step === 1) {
    return <EnterPhone />;
  }
}
