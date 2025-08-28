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
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function VerticalHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <TooltipProvider>
        <header className="fixed top-1/2 left-4 -translate-y-1/2 z-50 hidden md:flex flex-col items-center">
          <div className="rounded-full glassmorphism flex flex-col items-center p-2 gap-2">
            <nav className="flex flex-col items-center gap-2">
              {NAV_LINKS.map((link) =>
                link.subLinks ? (
                  <DropdownMenu key={link.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={pathname.startsWith(link.href) ? 'default' : 'ghost'}
                            size="icon"
                            className="rounded-full transition-all hover:shadow-glow hover:bg-primary/20 w-12 h-12"
                          >
                            <link.icon />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="right" className="glassmorphism ml-2">
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
                        className="rounded-full transition-all hover:shadow-glow hover:bg-primary/20 w-12 h-12"
                      >
                        <Link href={link.href}>
                          <link.icon />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </nav>
          </div>
        </header>
      </TooltipProvider>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t md:hidden glassmorphism">
          <div className="container mx-auto flex items-center justify-around h-16">
              {NAV_LINKS.filter(l => ['Home', 'Services', 'Contact'].includes(l.label)).map((link) => (
                 <Link key={link.label} href={link.href} className={cn(
                   "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                   pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                 )}>
                    <link.icon className="h-6 w-6" />
                    <span className="text-xs">{link.label}</span>
                 </Link>
              ))}
               <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1 p-2 h-auto text-muted-foreground hover:text-primary">
                        <Menu className="h-6 w-6" />
                        <span className="text-xs">Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto w-full p-0 border-t-0 glassmorphism">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b">
                        <Logo />
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                          <X className="h-6 w-6" />
                          <span className="sr-only">Close menu</span>
                        </Button>
                      </div>
                      <nav className="grid grid-cols-3 gap-2 p-4">
                        {NAV_LINKS.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={cn(
                              "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors text-center",
                              pathname.startsWith(link.href) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <link.icon className="h-7 w-7" />
                            <span className="text-sm font-medium">{link.label}</span>
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
              </Sheet>
          </div>
      </div>
    </>
  );
}
