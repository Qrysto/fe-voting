'use client';

import { useRef, Fragment } from 'react';
import DigitInput from '@/components/DigitInput';
import { useStore } from '@/store';
import { phoneDigitCount } from '@/constants';
import { cn } from '@/lib/utils';

export default function PhoneInput({
  focusConfirmBtn,
  fontSize = 48,
}: {
  focusConfirmBtn: () => void;
  fontSize?: number;
}) {
  const digits = useStore((state) => state.phoneDigits);
  const phoneError = useStore((state) => state.phoneError);
  const setDigit = useStore((state) => state.setPhoneDigit);
  const setDigits = useStore((state) => state.setPhoneDigits);
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement | null>> =
    useRef(Array(phoneDigitCount).fill(null));

  return (
    <div
      className="mx-auto flex items-center justify-between"
      style={{ maxWidth: fontSize * 9 }}
    >
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
            style={{ fontSize }}
            error={!!phoneError}
          />
          {(i === 2 || i === 5) && <div className="w-1"></div>}
        </Fragment>
      ))}
    </div>
  );
}
