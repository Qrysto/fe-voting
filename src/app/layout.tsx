import type { Metadata } from 'next';
import { oswald, montserrat } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-medium ${oswald.variable} ${montserrat.variable} ${montserrat.className}`}
      >
        <div className="container md:max-w-3xl">{children}</div>
      </body>
    </html>
  );
}
