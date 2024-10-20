'use client';

import { useRef, useState, useEffect } from 'react';
import BigButton from '@/components/BigButton';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/store';
import PhoneInput from '@/components/PhoneInput';

export default function EnterPhone() {
  const phoneFilled = useStore((state) =>
    state.phoneDigits.every((digit) => digit)
  );
  const phoneError = useStore((state) => state.phoneError);
  const confirmPhoneNumber = useStore((state) => state.confirmPhoneNumber);
  const confirmBtnRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);
  const optedIn = useStore((state) => state.optedIn);
  const switchOptedIn = useStore((state) => state.switchOptedIn);

  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);
  const [smallScreen, setSmallScreen] = useState(false);
  useEffect(() => {
    if (part1Ref.current && part2Ref.current) {
      if (
        part1Ref.current.getBoundingClientRect().bottom >
        part2Ref.current.getBoundingClientRect().top
      ) {
        setSmallScreen(true);
      }
    }
  }, []);

  return (
    <div className="mb-40">
      <div ref={part1Ref}>
        <p className="text-lg leading-6">
          Thank you for watching the Free & Equal Presidential Debate. Who do
          you think won the debate? Cast your vote for your preferred candidate!
        </p>
        <p className="mt-2 text-lg leading-6">
          To ensure fairness, please limit yourself to one vote per person and
          avoid the use of VOIP numbers for voting.
        </p>
        <h2
          className={`mb-10 mt-6 px-8 text-center text-2xl uppercase ${
            phoneError ? 'text-red' : ''
          }`}
        >
          {phoneError || 'Please enter your mobile phone number below'}
        </h2>

        <PhoneInput
          focusConfirmBtn={() => {
            confirmBtnRef.current?.focus();
          }}
        />
        <div className="mx-auto mt-6 max-w-md space-x-2 text-center">
          <Checkbox
            id="opt-out"
            checked={optedIn}
            onCheckedChange={(checked) => switchOptedIn(!!checked)}
            className="align-middle"
          />
          &nbsp;
          <label htmlFor="opt-out" className="align-middle">
            Receive texts from Free & Equal Elections Foundation about debates
            and voting information
          </label>
        </div>
      </div>

      <div
        className={`py-8 [background:_linear-gradient(transparent,rgba(0,0,0,0.4))] ${
          smallScreen ? 'px-4' : 'fixed bottom-0 left-0 right-0 px-8'
        }`}
        ref={part2Ref}
      >
        <div className="container px-0 md:max-w-3xl">
          <BigButton
            primary
            disabled={!phoneFilled}
            className="mt-8 shadow-md"
            ref={confirmBtnRef}
            action={confirmPhoneNumber}
          >
            Send code to me
          </BigButton>
        </div>
      </div>
    </div>
  );
}
