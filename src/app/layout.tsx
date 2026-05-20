import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { LayoutWrapper } from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Raithabhandhu - AI Farming Companion',
  description: 'An AI-powered multilingual voice farming companion that helps Indian farmers track crop schedules, weather advisories, mandi rates, and government schemes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-stone-50/50 text-stone-900 flex flex-col md:flex-row antialiased`}>
        <AppProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
