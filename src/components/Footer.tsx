
'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CONTACT_DETAILS, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { Separator } from './ui/separator';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRef, useActionState } from 'react';
import { useEffect } from 'react';
import { subscribeToNewsletter } from '@/app/actions/emailActions';


export function Footer() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(subscribeToNewsletter, {
    message: '',
    status: 'idle'
  });

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Subscribed!',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  const SubmitButton = () => {
    return (
      <Button type="submit" className="bg-gradient-to-r from-accent to-destructive text-white shadow-lg transition-transform duration-300 hover:scale-105">
        <Send className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    )
  }

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
            <form ref={formRef} action={formAction} className="flex w-full max-w-sm flex-col gap-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="bg-background text-foreground placeholder:text-muted-foreground"
                required
              />
              <SubmitButton />
            </form>
          </div>
        </div>

        {/* Footer Links & Info */}
          <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 sm:text-left">
            <div className="col-span-1 lg:col-span-2 sm:col-span-2 mx-auto sm:mx-0">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground">Leading provider of technology solutions specializing in telecom infrastructure, GIS solutions, and professional development services.</p>
            </div>

          <div className="col-span-1">
            <h3 className="font-headline font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.find((l) => l.label === 'Services')?.subLinks?.map((link) => (
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
              {NAV_LINKS.filter(l => ['About Us', 'Contact', 'Blog', 'Life at Digital Indian', 'Career'].includes(l.label)).map((link) => (
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
    {/* Address */}
    <li className="flex items-start gap-2 justify-center sm:justify-start">
      <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
      <a
        href="https://www.google.com/maps/place/EN+BLOCK,+EN+-+9,+EN+Block,+Sector+V,+Bidhannagar,+Kolkata,+West+Bengal+700091/@22.5736047,88.4314241,622m/data=!3m1!1e3!4m6!3m5!1s0x3a0275afb2dd949b:0xcaff4cf09f3240cf!8m2!3d22.5736058!4d88.43239!16s%2Fg%2F11rkm75qlp"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        {CONTACT_DETAILS.address}
      </a>
    </li>

    {/* Phone */}
    <li className="flex items-center gap-2 justify-center sm:justify-start">
      <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
      <a
        href={`tel:${CONTACT_DETAILS.phone}`}
        className="hover:underline"
      >
        {CONTACT_DETAILS.phone}
      </a>
    </li>

    {/* Email */}
    <li className="flex items-center gap-2 justify-center sm:justify-start">
      <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
      <a
        href={`mailto:${CONTACT_DETAILS.email}`}
        className="hover:underline"
      >
        {CONTACT_DETAILS.email}
      </a>
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
