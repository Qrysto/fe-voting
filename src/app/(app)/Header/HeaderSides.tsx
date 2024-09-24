'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useStore } from '@/store';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ResultLinks from '@/components/ResultLinks';
import { usePathname } from 'next/navigation';
import { oswald } from '@/fonts';
import { cn } from '@/lib/utils';
import backIcon from './arrow-left.svg';
import shareIcon from './shareIcon.svg';

export function HeaderLeft() {
  const pathname = usePathname();

  if (pathname === '/vote') {
    return <VotePageHeaderLeft />;
  }
  if (pathname.startsWith('/result')) {
    return <ResultPageHeaderLeft />;
  }
  if (pathname.startsWith('/verify')) {
    return <VerifyPageHeaderLeft />;
  }
  return null;
}

function VotePageHeaderLeft() {
  const goBack = useStore((state) => state.goBack);
  const canGoBack = useStore((state) => !!state.phoneNumber);

  return (
    canGoBack && (
      <div className="absolute inset-y-0 left-0 flex items-center object-right-top">
        <IconButton onClick={goBack}>
          <Image src={backIcon} height={18} alt="Back" />
        </IconButton>
      </div>
    )
  );
}

function ResultPageHeaderLeft() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute inset-y-0 left-[-1rem] flex items-center object-left-top">
      <Sheet open={open} onOpenChange={setOpen}>
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
            <ResultLinks
              onLinkClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function VerifyPageHeaderLeft() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('poll');
  const router = useRouter();

  return (
    <div className="absolute inset-y-0 left-0 flex items-center object-right-top">
      <IconButton
        onClick={() => {
          router.push(`/result/${pollId}`);
        }}
        className="flex items-center"
      >
        <Image src={backIcon} height={16} alt="Back" />
        <span
          className={cn('ml-1 text-lg uppercase text-blue', oswald.className)}
        >
          Result
        </span>
      </IconButton>
    </div>
  );
}

export function HeaderRight() {
  const pathname = usePathname();
  const url = `https://vote.freeandequal.org${pathname}`;
  return (
    <div className="absolute inset-y-0 right-0 flex items-center object-right-top">
      <IconButton
        className="ml-4"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
      >
        <Image src={shareIcon} height={23} alt="Share" />
      </IconButton>
    </div>
  );
}

function IconButton({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'a'>) {
  return (
    <a className={cn('px-1 py-1', className)} {...rest}>
      {children}
    </a>
  );
}
