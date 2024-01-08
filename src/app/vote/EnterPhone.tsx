'use client';

import { useRef, Fragment } from 'react';
import DigitInput from '@/components/DigitInput';
import BigButton from '@/components/BigButton';
import { useStore } from '@/store';
import { phoneDigitCount } from '@/constants';

function PhoneInput({ focusConfirmBtn }: { focusConfirmBtn: () => void }) {
  const digits = useStore((state) => state.phoneDigits);
  const setDigit = useStore((state) => state.setPhoneDigit);
  const inputDivs: React.MutableRefObject<Array<HTMLDivElement>> = useRef(
    Array(phoneDigitCount).fill(null)
  );

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
            deletePreviousDigit={() => {
              if (i > 0) {
                inputDivs.current[i - 1]?.focus();
                if (digits[i - 1] !== '') {
                  setDigit(i - 1, '');
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
  const phoneFilled = useStore((state) =>
    state.phoneDigits.every((digit) => digit)
  );
  const confirmPhoneNumber = useStore((state) => state.confirmPhoneNumber);
  const confirmBtnRef: React.MutableRefObject<HTMLButtonElement | null> =
    useRef(null);

  return (
    <div>
      <div className="">
        <h2 className="px-8 text-center text-2xl uppercase">
          Please enter your mobile phone number below
        </h2>
        <PhoneInput
          focusConfirmBtn={() => {
            confirmBtnRef.current?.focus();
          }}
        />
      </div>

      <div className="inset absolute bottom-0 left-0 right-0 px-8 pb-8 pt-2">
        <h2 className="mb-3 text-4xl uppercase">Look for your Code</h2>
        <p className="text-lg leading-6">
          We sent you a text to your device. Please check and enter your code to
          confirm your identity.
        </p>
        <BigButton
          primary
          disabled={!phoneFilled}
          className="mt-8"
          ref={confirmBtnRef}
          onClick={confirmPhoneNumber}
        >
          Send code to me
        </BigButton>
      </div>
    </div>
  );
}
