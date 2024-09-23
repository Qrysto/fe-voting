import { oswald } from '@/fonts';
import Spinner from './Spinner';
import { cn } from '@/lib/utils';
import { useState, forwardRef } from 'react';

export default forwardRef(function BigButton(
  {
    primary,
    children,
    className,
    disabled = false,
    action,
    href,
    target,
    ...rest
  }: {
    primary?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    action?: (...args: any[]) => Promise<any>;
    href?: string;
    target?: string;
  } & React.ComponentPropsWithoutRef<'button'> &
    React.ComponentPropsWithoutRef<'a'>,
  ref:
    | React.ForwardedRef<HTMLButtonElement>
    | React.ForwardedRef<HTMLAnchorElement>
) {
  const [busy, setBusy] = useState(false);

  const props = {
    className: cn(
      'flex items-center justify-center h-12 w-full rounded-md text-center font-bold uppercase',
      oswald.className,
      disabled || busy
        ? 'bg-gray text-white'
        : primary
          ? 'bg-blue text-white active:bg-blue/90'
          : 'bg-lightBlue text-blue active:bg-lightBlue/60',
      className
    ),
    disabled: disabled || busy,
    ...(action
      ? {
          onClick: async (...args: any) => {
            try {
              setBusy(true);
              return await action(...args);
            } finally {
              setBusy(false);
            }
          },
        }
      : null),
    children: (
      <>
        {busy && <Spinner inverse className="mr-2 inline-block" />}
        {children}
      </>
    ),
    ...rest,
  };

  if (href) {
    return (
      <a
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        {...props}
        href={href}
        target={target}
      />
    );
  } else {
    return (
      <button ref={ref as React.ForwardedRef<HTMLButtonElement>} {...props} />
    );
  }
});
