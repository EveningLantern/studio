
'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CONTACT_DETAILS, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { Separator } from './ui/separator';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for newsletter subscription
    alert('Thank you for subscribing!');
  };
  
  const serviceLinks = NAV_LINKS.find((l) => l.label === 'Services')?.subLinks;
  const companyLinks = NAV_LINKS.filter(l => ['About Us', 'Contact', 'Blog', 'Life at Digital Indian', 'Career'].includes(l.label));

  return (
    <footer className="text-card-foreground p-4 md:p-6 lg:p-8 pt-0">
      <div className="container mx-auto px-4 py-12">
        {/* Contact Snippet */}
        <div className="rounded-lg bg-primary/90 p-8 text-primary-foreground md:p-12 glassmorphism border-none">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="text-black">
              <h2 className="font-headline text-3xl font-bold">Stay Ahead of the Curve</h2>
              <p className="mt-2 max-w-2xl">Subscribe to our newsletter for the latest in tech solutions and industry insights.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button type="submit" className="bg-gradient-to-r from-accent to-destructive text-white shadow-lg transition-transform duration-300 hover:scale-105">
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:text-left">
          <div className="col-span-1 lg:col-span-1 sm:col-span-2 mx-auto sm:mx-0">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Engineering the Digital Future.</p>
          </div>

          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              {serviceLinks?.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                 <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="font-headline font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.address}</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.phone}</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{CONTACT_DETAILS.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Digital Indian. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Admin Login
            </Link>
            <Separator orientation="vertical" className="h-4" />
            {SOCIAL_LINKS.map((social) => (
              <Button key={social.name} variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/20">
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
