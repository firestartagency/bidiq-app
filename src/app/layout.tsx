import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import AuthGate from '@/components/AuthGate';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BidIQ — AI-Powered Proposal Intelligence',
  description: 'Federal bid ingestion, AI analysis, and proposal generation platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthGate>
          <div className="app-shell">
            <Sidebar />
            <div className="app-main">
              <TopBar />
              <main className="app-content">{children}</main>
            </div>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
