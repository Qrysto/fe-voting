'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ResultLinks from '@/components/ResultLinks';
import logo from './full-logo@2x.png';
import shareIcon from './shareIcon.svg';

function IconButton({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={'px-1 py-1 ' + (className || '')} {...rest}>
      {children}
    </a>
  );
}

export default function Header() {
  const { poll } = useParams();

  return (
    <header className="relative py-2">
      <div className="absolute inset-y-0 left-[-1rem] flex items-center object-left-top">
        <PollMenu />
      </div>

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
        <IconButton
          className="ml-4"
          href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Fvote.freeandequal.org%2Fresult%2F${poll}`}
          target="_blank"
        >
          <Image src={shareIcon} height={23} alt="Share" />
        </IconButton>
      </div>
    </header>
  );
}

function PollMenu() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-3xl uppercase text-darkBlue">
            Poll results
          </SheetTitle>
        </SheetHeader>
        <div className="mx-[-1.5rem] mt-8">
          <ResultLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
}
