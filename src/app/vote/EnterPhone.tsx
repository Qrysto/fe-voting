'use client';

import { useRef, Fragment } from 'react';
import DigitInput from '@/components/DigitInput';
import BigButton from '@/components/BigButton';
import { useStore } from '@/store';
import { phoneDigitCount } from '@/constants';

function PhoneInput({ focusConfirmBtn }: { focusConfirmBtn: () => void }) {
  const digits = useStore((state) => state.phoneDigits);
  const phoneError = useStore((state) => state.phoneError);
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
              const newIndex = setDigits(i, value);
              if (value) {
                if (newIndex < phoneDigitCount) {
                  inputDivs.current[newIndex]?.focus();
                } else {
                  // After the last digit is entered
                  // Check if there is any blank digit input
                  const firstEmptyIndex = digits.findIndex((digit) => !digit);
                  // The newly entered digits haven't been updated so ignore it if it's the first one found
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
                  setDigits(i - 1, '');
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

  return (
    <div>
      <div className="pt-8">
        <h2
          className={`px-8 text-center text-2xl uppercase ${
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
      </div>

      <div className="inset absolute bottom-0 left-0 right-0 px-8 pb-8 pt-2">
        <BigButton
          primary
          disabled={!phoneFilled}
          className="mt-8"
          ref={confirmBtnRef}
          action={confirmPhoneNumber}
        >
          Send code to me
        </BigButton>
      </div>
    </div>
  );
}
