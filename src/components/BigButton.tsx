import { oswald } from '@/fonts';
import Spinner from './Spinner';
import { useState, forwardRef } from 'react';

export default forwardRef(function BigButton(
  {
    primary,
    children,
    className,
    disabled = false,
    action,
    ...rest
  }: {
    primary?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    action?: (...args: any[]) => Promise<any>;
  } & React.ComponentPropsWithoutRef<'button'>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const [busy, setBusy] = useState(false);

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
      disabled={disabled || busy}
      {...(action
        ? {
            onClick: async (...args) => {
              try {
                setBusy(true);
                return await action(...args);
              } finally {
                setBusy(false);
              }
            },
          }
        : null)}
      {...rest}
    >
      {busy && <Spinner inverse className="mr-2 inline-block" />}
      <span className="align-middle">{children}</span>
    </button>
  );
});
