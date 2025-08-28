'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NAV_LINKS } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Briefcase, Info, Mail } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const getIconForLink = (label: string) => {
    switch (label) {
        case 'Home':
            return <Home />;
        case 'Services':
            return <Briefcase />;
        case 'About Us':
            return <Info />;
        case 'Contact':
            return <Mail />;
        default:
            return <Home />;
    }
}

export function VerticalHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <TooltipProvider>
        <header className="sticky top-0 z-50 hidden h-screen flex-col items-center border-l border-border/40 bg-card p-4 md:flex">
          <div className="mb-8">
            <Logo />
          </div>
          <nav className="flex flex-col items-center gap-4">
            {NAV_LINKS.map((link) =>
              link.subLinks ? (
                <DropdownMenu key={link.label} direction="left">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={pathname.startsWith(link.href) ? 'default' : 'ghost'}
                          size="icon"
                          className="rounded-full"
                        >
                          {getIconForLink(link.label)}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent side="left">
                    {link.subLinks.map((subLink) => (
                      <DropdownMenuItem key={subLink.label} asChild>
                        <Link href={subLink.href}>{subLink.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip key={link.label}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={pathname === link.href ? 'default' : 'ghost'}
                      size="icon"
                      className="rounded-full"
                    >
                      <Link href={link.href}>
                        {getIconForLink(link.label)}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
          </nav>
        </header>
      </TooltipProvider>

      {/* Mobile Bottom Bar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-2 md:hidden">
            <div className="container mx-auto flex items-center justify-between">
                <Logo />
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
            </div>
        </div>

        <SheetContent side="bottom" className="h-full w-full p-0">
          <div className="flex h-full flex-col bg-card">
            <div className="flex items-center justify-between p-4 border-b">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.subLinks ? (
                    <div className="flex flex-col gap-2">
                      <p className="px-4 font-medium text-foreground">{link.label}</p>
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.label}
                          href={subLink.href}
                          className="pl-8 text-muted-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="px-4 py-2 font-medium text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
