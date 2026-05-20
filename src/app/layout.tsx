import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farmer OS - AI-Powered Voice Companion',
  description: 'A voice-first farming companion helping Indian farmers track prices, set crop reminders, log farm activities, and browse government schemes.',
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
          {/* Main Layout Container */}
          <div className="flex flex-col md:flex-row w-full min-h-screen">
            {/* Navigation Sidebar */}
            <Sidebar />

            {/* Main Application Window */}
            <main className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
