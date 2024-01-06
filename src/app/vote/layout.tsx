import Image from 'next/image';
import logo from './full-logo@2x.png';

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="py-2">
        <Image
          src={logo}
          width={106}
          height={50}
          alt="Free & Equal"
          className="mx-auto"
        />
      </header>
      <main>{children}</main>
    </div>
  );
}
