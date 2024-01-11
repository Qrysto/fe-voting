import { useRef } from 'react';
import { oswald } from '@/fonts';

const digitRegex = /\d/;

export default function DigitInput({
  className,
  value,
  setValue,
  deletePreviousDigit,
  error,
  passRef,
  ...rest
}: {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  deletePreviousDigit: () => void;
  error?: boolean;
  passRef: (el: HTMLInputElement | null) => void;
} & React.ComponentPropsWithoutRef<'div'>) {
  const inputRef = useRef<HTMLInputElement | null>();

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      ref={(el) => {
        inputRef.current = el;
        passRef(el);
      }}
      tabIndex={0}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value
          ?.split('')
          .filter((char) => digitRegex.test(char))
          .join('');
        if (newVal.length) {
          setValue(newVal);
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'Backspace':
            if (!value) deletePreviousDigit();
          case 'Delete':
          case 'Clear':
            if (value) setValue('');
            break;
        }
      }}
      onFocus={() => {
        inputRef.current?.select();
      }}
      className={`flex h-[1.47em] w-[0.67em] items-center justify-center rounded-[3px] border-2 border-solid py-2 text-center caret-transparent ${
        error ? 'border-red bg-red/5' : value ? 'border-green' : 'border-gray'
      }  outline-none focus:border-blue ${
        oswald.className
      } font-medium ${className}  ${error ? 'text-red' : 'text-darkBlue'}`}
      {...rest}
    />
  );
}
