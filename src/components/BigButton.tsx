import { oswald } from '@/app/fonts';

export default function BigButton({
  primary,
  children,
  className,
}: {
  primary?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`block h-12 w-full rounded-md ${
        oswald.className
      } text-center font-bold uppercase ${
        primary ? 'bg-blue text-white' : 'bg-lightBlue text-blue'
      } ${className || ''}`}
    >
      {children}
    </button>
  );
}
