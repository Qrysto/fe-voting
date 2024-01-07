'use client';

import { setStep } from './voteStep';

export default function StepCircle({
  num,
  activeStep,
}: {
  num: number;
  activeStep: number;
}) {
  const active = activeStep === num;
  const past = activeStep > num;

  return (
    <button
      className={
        'flex size-7 items-center justify-center rounded-full font-oswald text-lg ' +
        (active
          ? 'bg-blue text-white'
          : past
            ? 'bg-lightBlue text-blue'
            : 'border border-solid border-gray bg-white text-gray')
      }
      onClick={() => {
        setStep(num);
      }}
    >
      {num}
    </button>
  );
}
