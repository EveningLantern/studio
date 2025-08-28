import Link from 'next/link';
import { Network } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ scrolled }: { scrolled?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Digital Indian Homepage">
      <Network className="h-7 w-7 text-primary transition-transform duration-300 ease-in-out" />
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        scrolled ? "w-0" : "w-48"
      )}>
        <span className="font-headline text-xl font-bold whitespace-nowrap">
          <span className="glowing-text">Digital</span>
          <span className="text-green-500">Indian</span>
        </span>
      </div>
    </Link>
  );
}
