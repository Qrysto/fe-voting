'use client';

import { useState, useRef, Fragment } from 'react';
import DigitInput from '@/components/DigitInput';
import BigButton from '@/components/BigButton';

const digitCount = 10;

function PhoneInput() {
  const [digits, setDigits] = useState(Array(digitCount).fill(''));
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement>> = useRef(
    Array(digitCount).fill(null)
  );

  return (
    <div className="mx-auto mt-10 flex max-w-md items-center justify-between">
      {digits.map((digit, i) => (
        <Fragment key={i}>
          <DigitInput
            passRef={(el) => {
              inputDivs.current[i] = el;
            }}
            value={digit}
            setValue={(value) => {
              const newDigits = [...digits];
              newDigits.splice(i, 1, value);
              setDigits(newDigits);
              if (value) {
                if (i < digitCount - 1) {
                  inputDivs.current[i + 1]?.focus();
                } else {
                  inputDivs.current[i]?.blur();
                }
              }
            }}
            deletePreviousDigit={() => {
              if (i > 0) {
                inputDivs.current[i - 1]?.focus();
                if (digits[i - 1] !== '') {
                  const newDigits = [...digits];
                  newDigits.splice(i - 1, 1, '');
                  setDigits(newDigits);
                }
              }
            }}
            className="text-5xl"
          />
          {(i === 2 || i === 5) && <div className="w-1"></div>}
        </Fragment>
      ))}
    </div>
  );
}

export default function EnterPhone() {
  return (
    <div>
      <div className="mb-8 mt-2">
        <h2 className="px-8 text-center text-2xl uppercase">
          Please enter your mobile phone number below
        </h2>
        <PhoneInput />
      </div>

      <div className="inset absolute bottom-0 left-0 right-0 px-8 pb-8 pt-2">
        <h2 className="mb-3 text-4xl uppercase">Look for your Code</h2>
        <p className="text-lg leading-6">
          We sent you a text to your device. Please check and enter your code to
          confirm your identity.
        </p>
        <BigButton primary className="mt-8">
          submit and confirm code
        </BigButton>
      </div>
    </div>
  );
}
