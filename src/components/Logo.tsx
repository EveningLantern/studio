import Link from 'next/link';
import { Network } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Digital Indian Homepage">
      <Network className="h-7 w-7 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        Digital
        <span className="glowing-text">Indian</span>
      </span>
    </Link>
  );
}
