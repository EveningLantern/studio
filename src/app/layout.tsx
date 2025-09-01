
'use client';

import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { VerticalHeader } from '@/components/VerticalHeader';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/Logo';
import { AuthProvider } from '@/contexts/AuthContext';
import Chatbot from '@/components/Chatbot';

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-headline',
});



const fontInter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [animationClass, setAnimationClass] = useState('animate-page-in');
  const [pageKey, setPageKey] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    if (pathname !== pageKey) {
      setAnimationClass('animate-page-out');
      const timer = setTimeout(() => {
        setPageKey(pathname);
        setAnimationClass('animate-page-in');
      }, 500); // Reduced animation time
      return () => clearTimeout(timer);
    }
  }, [pathname, pageKey]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Digital Indian</title>
        <meta name="description" content="An elegant, modern, and trustworthy website for the technology solutions provider Digital Indian." />
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontPoppins.variable,
          fontInter.variable
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
            <div className={cn(
                "fixed top-0 left-0 z-50 transition-all duration-300",
                scrolled ? "p-4" : "p-4 md:p-6 lg:p-8"
              )}>
                <Logo scrolled={scrolled} />
              </div>
            <div className="flex flex-1">
              <VerticalHeader />
              <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8 md:ml-20">
                <div
                  key={pageKey}
                  className={cn(
                    'h-full w-full rounded-2xl glassmorphism shadow-2xl shadow-primary/10',
                    animationClass
                  )}
                >
                  <div className={cn("cut-corner h-full w-full transition-all duration-300", !scrolled && "pt-12 md:pt-10")}>
                    <ScrollArea className="h-full w-full rounded-2xl">
                      {children}
                    </ScrollArea>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <Toaster />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
