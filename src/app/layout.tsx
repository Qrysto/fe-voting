import type { Metadata } from 'next';
import { oswald, montserrat } from '../fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free And Equal Voting App',
  description: 'Free and Equal blockchain voting system powered by nexus.io.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`fixed bottom-0 left-0 right-0 top-0 font-medium ${oswald.variable} ${montserrat.variable} ${montserrat.className}`}
      >
        <div className="container relative h-full overflow-y-auto md:max-w-3xl">
          {children}
        </div>
      </body>
    </html>
  );
}
