import { oswald } from '@/fonts';
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
            ? 'bg-blue text-white active:bg-blue/90'
            : 'bg-lightBlue text-blue active:bg-lightBlue/60'
      } ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  );
});
