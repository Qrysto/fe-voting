import { oswald } from '@/app/fonts';

export default function BigButton({
  primary,
  children,
  className,
  disabled = false,
}: {
  primary?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`block h-12 w-full rounded-md ${
        oswald.className
      } text-center font-bold uppercase ${
        disabled
          ? 'bg-gray text-white'
          : primary
            ? 'bg-blue text-white'
            : 'bg-lightBlue text-blue'
      } ${className || ''}`}
    >
      {children}
    </button>
  );
}
