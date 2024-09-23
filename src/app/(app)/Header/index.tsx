import Link from 'next/link';
import Image from 'next/image';
import { HeaderLeft, HeaderRight } from './HeaderSides';
import logo from './full-logo@2x.png';

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

      <HeaderLeft />
      <HeaderRight />
    </header>
  );
}
