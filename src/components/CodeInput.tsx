'use client';

import { useRef } from 'react';
import DigitInput from '@/components/DigitInput';
import { useStore } from '@/store';
import { codeDigitCount } from '@/constants';

export default function CodeInput({
  focusConfirmBtn,
  fontSize = 78,
}: {
  focusConfirmBtn: () => void;
  fontSize?: number;
}) {
  const digits = useStore((state) => state.codeDigits);
  const setDigit = useStore((state) => state.setCodeDigit);
  const setDigits = useStore((state) => state.setCodeDigits);
  const codeError = useStore((state) => state.codeError);
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement | null>> =
    useRef(Array(codeDigitCount).fill(null));

  return (
    <div
      className="mx-auto flex items-center justify-between"
      style={{ maxWidth: fontSize * 5.4 }}
    >
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
          style={{ fontSize }}
          error={!!codeError}
        />
      ))}
    </div>
  );
}
