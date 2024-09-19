import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { oswald, montserrat } from '../fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vote.freeandequal.org/'),
  title: 'Free And Equal Voting App',
  description:
    'Free and Equal blockchain voting system powered by nexus.io. Powered by nexus.io.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        /* making right-0 !important because somehow Drawer component leaves a `right: unset` style after closing */
        className={cn(
          'bg-background fixed !right-0 bottom-0 left-0 top-0 font-medium',
          oswald.variable,
          montserrat.variable,
          montserrat.className
        )}
      >
        <div className="container relative h-full overflow-y-auto md:max-w-3xl">
          {children}
        </div>
      </body>
    </html>
  );
}
