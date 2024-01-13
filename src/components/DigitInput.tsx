import { useRef } from 'react';
import { oswald } from '@/fonts';

const digitRegex = /\d/;

export default function DigitInput({
  className,
  value,
  setValue,
  paste,
  deletePreviousDigit,
  error,
  passRef,
  ...rest
}: {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  paste: (value: string) => void;
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
      onChange={() => {}}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            setValue(e.key);
            break;
          case 'Backspace':
            if (!value) deletePreviousDigit();
          case 'Delete':
          case 'Clear':
            if (value) setValue('');
            break;
        }
      }}
      onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text/plain');
        const numericText = text
          ?.split('')
          .filter((char) => digitRegex.test(char))
          .join('');
        paste(numericText);
      }}
      onFocus={() => {
        inputRef.current?.select();
      }}
      className={`flex h-[1.47em] w-[0.67em] items-center justify-center rounded-[3px] border-2 border-solid text-center leading-[1.47em] caret-transparent ${
        error ? 'border-red bg-red/5' : value ? 'border-green' : 'border-gray'
      }  outline-none focus:border-blue ${
        oswald.className
      } font-medium ${className}  ${error ? 'text-red' : 'text-darkBlue'}`}
      {...rest}
    />
  );
}
