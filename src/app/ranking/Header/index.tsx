import Link from 'next/link';
import Image from 'next/image';
import logo from './full-logo@2x.png';
import shareIcon from './shareIcon.svg';

function IconButton({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={'px-1 py-1 ' + (className || '')} {...rest}>
      {children}
    </button>
  );
}

export default function Header() {
  return (
    <header className="relative py-2">
      <Link href="/">
        <Image
          src={logo}
          width={106}
          height={50}
          alt="Free & Equal"
          className="mx-auto"
          priority
        />
      </Link>
      <div className="absolute inset-y-0 right-0 flex items-center object-right-top">
        <IconButton className="ml-4">
          <Image src={shareIcon} height={23} alt="Share" />
        </IconButton>
      </div>
    </header>
  );
}