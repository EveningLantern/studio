import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { VerticalHeader } from '@/components/VerticalHeader';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-headline',
});

const fontInter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Digital Indian: Empowering Tech Solutions',
  description: 'An elegant, modern, and trustworthy website for the technology solutions provider Digital Indian.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontPoppins.variable,
          fontInter.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          <div className="flex flex-1">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="h-full rounded-2xl border bg-card text-card-foreground shadow-lg animate-page-in">
                {children}
              </div>
            </main>
            <VerticalHeader />
          </div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
