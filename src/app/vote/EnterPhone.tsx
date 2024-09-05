'use client';

import { useRef, Fragment, useState, useEffect } from 'react';
import DigitInput from '@/components/DigitInput';
import BigButton from '@/components/BigButton';
import { useStore } from '@/store';
import { phoneDigitCount } from '@/constants';

function PhoneInput({ focusConfirmBtn }: { focusConfirmBtn: () => void }) {
  const digits = useStore((state) => state.phoneDigits);
  const phoneError = useStore((state) => state.phoneError);
  const setDigit = useStore((state) => state.setPhoneDigit);
  const setDigits = useStore((state) => state.setPhoneDigits);
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement | null>> =
    useRef(Array(phoneDigitCount).fill(null));

  return (
    <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
      {digits.map((digit, i) => (
        <Fragment key={i}>
          <DigitInput
            autoFocus={i === 0}
            passRef={(el) => {
              inputDivs.current[i] = el;
            }}
            value={digit}
            setValue={(value) => {
              setDigit(i, value);
              if (value) {
                if (i < phoneDigitCount - 1) {
                  inputDivs.current[i + 1]?.focus();
                } else {
                  // After the last digit is entered
                  // Check if there is any blank digit input
                  const firstEmptyIndex = digits.findIndex((digit) => !digit);
                  // The last digit hasn't been recorded so ignore it if it's the first one found
                  if (
                    firstEmptyIndex === -1 ||
                    firstEmptyIndex === phoneDigitCount - 1
                  ) {
                    focusConfirmBtn();
                  }
                }
              }
            }}
            paste={(value) => {
              const newIndex = setDigits(i, value);
              if (value) {
                if (newIndex < phoneDigitCount) {
                  inputDivs.current[newIndex]?.focus();
                } else {
                  // After the last digit is entered
                  // Check if there is any blank digit input
                  const firstEmptyIndex = digits.findIndex((digit) => !digit);
                  // The newly pasted digits haven't been updated so ignore it if it's the first one found
                  if (firstEmptyIndex === -1 || firstEmptyIndex === i) {
                    focusConfirmBtn();
                  }
                }
              }
            }}
            deletePreviousDigit={() => {
              if (i > 0) {
                inputDivs.current[i - 1]?.focus();
                if (digits[i - 1] !== '') {
                  setDigit(i - 1, '');
                }
              }
            }}
            className="text-5xl"
            error={!!phoneError}
          />
          {(i === 2 || i === 5) && <div className="w-1"></div>}
        </Fragment>
      ))}
    </div>
  );
}

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
          className={`mt-6 px-8 text-center text-2xl uppercase ${
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
        <div className="mx-auto mt-6 max-w-md text-center">
          <input
            type="checkbox"
            id="opt-out"
            checked={optedIn}
            onChange={(evt) => switchOptedIn(evt.target.checked)}
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
