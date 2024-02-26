'use client';

import { useRef, useEffect, useState } from 'react';
import DigitInput from '@/components/DigitInput';
import BigButton from '@/components/BigButton';
import LinkButton from '@/components/LinkButton';
import { useStore } from '@/store';
import { codeDigitCount } from '@/constants';

function CodeInput({ focusConfirmBtn }: { focusConfirmBtn: () => void }) {
  const digits = useStore((state) => state.codeDigits);
  const setDigit = useStore((state) => state.setCodeDigit);
  const setDigits = useStore((state) => state.setCodeDigits);
  const codeError = useStore((state) => state.codeError);
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement | null>> =
    useRef(Array(codeDigitCount).fill(null));

  return (
    <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
      {digits.map((digit, i) => (
        <DigitInput
          key={i}
          autoFocus={i === 0}
          passRef={(el) => {
            inputDivs.current[i] = el;
          }}
          value={digit}
          setValue={(value) => {
            setDigit(i, value);
            if (value) {
              if (i < codeDigitCount - 1) {
                inputDivs.current[i + 1]?.focus();
              } else {
                // After the last digit is entered
                // Check if there is any blank digit input
                const firstEmptyIndex = digits.findIndex((digit) => !digit);
                // The last digit hasn't been recorded so ignore it if it's the first one found
                if (
                  firstEmptyIndex === -1 ||
                  firstEmptyIndex === codeDigitCount - 1
                ) {
                  focusConfirmBtn();
                }
              }
            }
          }}
          paste={(value) => {
            const newIndex = setDigits(i, value);
            if (value) {
              if (newIndex < codeDigitCount) {
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
          className="text-[78px]"
          error={!!codeError}
        />
      ))}
    </div>
  );
}

export default function ConfirmCode() {
  const codeFilled = useStore((state) =>
    state.codeDigits.every((digit) => digit)
  );
  const phoneNumber = useStore((state) => state.phoneNumber);
  const codeError = useStore((state) => state.codeError);
  const confirmCode = useStore((state) => state.confirmCode);
  const requestCode = useStore((state) => state.requestCode);
  const confirmBtnRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);

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
    <div>
      <div className="pt-8" ref={part1Ref}>
        <h2
          className={`px-4 text-center text-2xl uppercase ${
            codeError ? 'text-red' : ''
          }`}
        >
          {codeError || 'Please confirm your identity'}
        </h2>
        <CodeInput
          focusConfirmBtn={() => {
            confirmBtnRef.current?.focus();
          }}
        />
        <div className="mt-8 text-center">
          <LinkButton action={requestCode}>Get a new code</LinkButton>
        </div>
      </div>

      <div
        className={`py-8 ${
          smallScreen ? 'px-4' : 'absolute bottom-0 left-0 right-0 px-8'
        }`}
        ref={part2Ref}
      >
        <h2 className="mb-3 text-4xl uppercase">Look for your Code</h2>
        <p className="text-lg leading-6">
          We sent you a text to your phone number +1{phoneNumber}. Please check
          and enter your code to confirm your identity.
        </p>
        <BigButton
          primary
          disabled={!codeFilled}
          className="mt-8"
          ref={confirmBtnRef}
          onClick={confirmCode}
        >
          Submit and Confirm code
        </BigButton>
      </div>
    </div>
  );
}
