import { oswald } from '@/fonts';
import { forwardRef } from 'react';

export default forwardRef(function LinkButton(
  {
    children,
    className,
    disabled = false,
    ...rest
  }: {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
  } & React.ComponentPropsWithoutRef<'button'>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      className={`font-bold uppercase text-blue underline active:text-blue/90 ${
        oswald.className
      }  ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  );
});
