import { oswald } from '@/app/fonts';

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function DigitInput({
  className,
  value,
  setValue,
  error,
  ref,
  ...rest
}: {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  error?: boolean;
  ref: (el: HTMLDivElement) => void;
}) {
  return (
    <div
      ref={ref}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (digits.includes(e.key)) {
          setValue(e.key);
        } else if (
          e.key === 'Backspace' ||
          e.key === 'Delete' ||
          e.key === 'Clear'
        ) {
          setValue('');
        }
      }}
      className={`flex h-[1.47em] w-[0.67em] items-center justify-center rounded-[3px] border-2 border-solid ${
        error ? 'border-red bg-red/5' : value ? 'border-green' : 'border-gray'
      }  focus:border-blue ${oswald.className} font-medium ${className}  ${
        error ? 'text-red' : 'text-darkBlue'
      }`}
      {...rest}
    >
      {value}
    </div>
  );
}
