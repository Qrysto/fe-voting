'use client';

import { useState, useRef } from 'react';
import DigitInput from '@/components/DigitInput';

const digitCount = 10;

function PhoneInput() {
  const [digits, setDigits] = useState(Array(digitCount).fill(''));
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement>> = useRef(
    Array(digitCount).fill(null)
  );

  return (
    <div className="flex items-center justify-between">
      {digits.map((digit, i) => (
        <DigitInput
          key={i}
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
                inputDivs.current[i + 1].focus();
              } else {
                inputDivs.current[i + 1].blur();
              }
            }
          }}
          className="text-5xl"
        />
      ))}
    </div>
  );
}

export default function EnterPhone() {
  return (
    <div>
      <h2 className="px-8 text-center text-2xl uppercase">
        Please enter your mobile phone number below
      </h2>
      <PhoneInput />
    </div>
  );
}
