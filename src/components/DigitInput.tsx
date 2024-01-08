import { oswald } from '@/app/fonts';

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
  [prop: string]: any;
}) {
  return (
    <div
      ref={passRef}
      tabIndex={0}
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
