import { oswald } from '@/fonts';
import { forwardRef, useState } from 'react';
import Spinner from './Spinner';

export default forwardRef(function LinkButton(
  {
    children,
    className,
    disabled = false,
    action,
    ...rest
  }: {
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
      disabled={disabled || busy}
      className={`font-bold uppercase ${oswald.className}  ${className || ''} ${
        disabled || busy ? 'text-gray' : 'text-blue active:text-blue/90'
      }`}
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
      {busy && <Spinner className="mr-2 inline-block" />}
      <span className="align-middle underline underline-offset-2">
        {children}
      </span>
    </button>
  );
});
