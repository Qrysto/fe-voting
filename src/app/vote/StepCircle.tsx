'use client';

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
    <div
      className={
        'flex size-7 items-center justify-center rounded-full font-oswald text-lg ' +
        (active
          ? 'bg-blue text-white'
          : past
            ? 'bg-lightBlue text-blue'
            : 'border border-solid border-gray bg-white text-gray')
      }
    >
      {num}
    </div>
  );
}
