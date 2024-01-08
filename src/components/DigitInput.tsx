import { oswald } from '@/app/fonts';

const validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
  passRef: (el: HTMLDivElement) => void;
}) {
  return (
    <div
      ref={passRef}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (validDigits.includes(e.key)) {
          setValue(e.key);
        } else if (e.key === 'Delete' || e.key === 'Clear') {
          setValue('');
        } else if (e.key === 'Backspace') {
          if (value) {
            setValue('');
          } else {
            deletePreviousDigit();
          }
        }
      }}
      className={`flex h-[1.47em] w-[0.67em] items-center justify-center rounded-[3px] border-2 border-solid ${
        error ? 'border-red bg-red/5' : value ? 'border-green' : 'border-gray'
      }  outline-none focus:border-blue ${
        oswald.className
      } font-medium ${className}  ${error ? 'text-red' : 'text-darkBlue'}`}
      {...rest}
    >
      {value}
    </div>
  );
}
