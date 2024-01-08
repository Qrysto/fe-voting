'use client';

import Header from '@/components/Header';
import StepCircle from './StepCircle';
import { useStep } from '@/store';

function Dash({ active }: { active?: boolean }) {
  return (
    <div
      className={
        'mx-1.5 h-1 w-8 border-t border-solid ' +
        (active ? 'border-blue' : 'border-gray')
      }
    ></div>
  );
}

function Steps() {
  const step = useStep();

  return (
    <div className="mb-16 mt-8 flex items-center justify-center">
      <StepCircle num={1} activeStep={step} />
      <Dash active={step >= 2} />
      <StepCircle num={2} activeStep={step} />
      <Dash active={step >= 3} />
      <StepCircle num={3} activeStep={step} />
    </div>
  );
}

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>
        <Steps />
        {children}
      </main>
    </div>
  );
}
