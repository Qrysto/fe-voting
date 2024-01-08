import { oswald } from '@/app/fonts';
import { forwardRef } from 'react';

export default forwardRef(function BigButton(
  {
    primary,
    children,
    className,
    disabled = false,
    ...rest
  }: {
    primary?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
  } & React.ComponentPropsWithoutRef<'button'>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={`block h-12 w-full rounded-md ${
        oswald.className
      } text-center font-bold uppercase ${
        disabled
          ? 'bg-gray text-white'
          : primary
            ? 'bg-blue text-white'
            : 'bg-lightBlue text-blue'
      } ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  );
});
