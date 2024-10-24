'use client';

import { useRef, useEffect, useState } from 'react';
import BigButton from '@/components/BigButton';
import LinkButton from '@/components/LinkButton';
import { useStore } from '@/store';
import { toast } from '@/lib/useToast';
import { toE164US } from '@/lib/phone';
import CodeInput from '@/components/CodeInput';

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
          className={`mb-10 px-4 text-center text-2xl uppercase ${
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
          <LinkButton
            action={async () => {
              await requestCode();
              toast({
                title: 'Code sent!',
                description: 'A new code has been sent to your phone number!',
              });
            }}
          >
            Get a new code
          </LinkButton>
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
          We sent you a text to your phone number {toE164US(phoneNumber)}.
          Please check and enter your code to confirm your identity.
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
