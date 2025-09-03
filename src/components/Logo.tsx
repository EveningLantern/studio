
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import logo from '../assets/logo.png'

export function Logo({ scrolled }: { scrolled?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Digital Indian Homepage">
      <Image
        src={logo}
        alt="Digital Indian Logo"
        width={48}
        height={48}
        className="h-15 w-15 transition-transform duration-300 ease-in-out"
        priority
        quality={100}
      />
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          scrolled ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-xs opacity-100 translate-x-0'
        )}
      >
        <span className="font-headline text-3xl font-bold whitespace-nowrap">
          <span className="text-primary">Digital</span>
          <span className="text-green-500">Indian</span>
        </span>
      </div>
    </Link>
  );
}
