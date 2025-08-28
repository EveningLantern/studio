'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CONTACT_DETAILS, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { Separator } from './ui/separator';

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for newsletter subscription
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Contact Snippet */}
        <div className="rounded-lg bg-primary p-8 text-primary-foreground md:p-12">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-headline text-3xl font-bold">Stay Ahead of the Curve</h2>
              <p className="mt-2 max-w-2xl">Subscribe to our newsletter for the latest in tech solutions and industry insights.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/70"
                required
              />
              <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Engineering the Digital Future.</p>
          </div>

          <div>
            <h3 className="font-headline font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.find((l) => l.label === 'Services')?.subLinks?.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.address}</span>
              </li>
              <li className="flex items-center">
                <span className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.phone}</span>
              </li>
              <li className="flex items-center">
                <span className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Digital Indian. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <Button key={social.name} variant="ghost" size="icon" asChild>
                <Link href={social.href} aria-label={social.name}>
                  <social.icon className="h-5 w-5" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
