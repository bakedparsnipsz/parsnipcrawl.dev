import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/features/TopBar/TopBar';

export const metadata: Metadata = {
  title: 'parsnipcrawl.dev',
  description: 'A software engineering blog that is also a dungeon.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
