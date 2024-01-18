import type { Metadata } from 'next';
import HomePage from './home';

export const metadata: Metadata = {
  title: 'Free And Equal Voting App',
  description:
    'Free and Equal blockchain voting system powered by nexus.io. Powered by nexus.io.',
  openGraph: {
    title: 'Free And Equal Voting App',
    description:
      'Free and Equal blockchain voting system powered by nexus.io. Powered by nexus.io.',
    url: 'https://vote.freeandequal.org/',
    type: 'website',
    siteName: 'Free And Equal Voting App',
  },
};

export default function Home() {
  return <HomePage />;
}
