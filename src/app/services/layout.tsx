'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SERVICES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card className="sticky top-20 p-4">
            <h2 className="p-4 font-headline text-xl font-semibold">Our Services</h2>
            <nav className="flex flex-col gap-1">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    pathname === `/services/${service.slug}`
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <service.icon className="h-5 w-5" />
                  <span>{service.title}</span>
                </Link>
              ))}
            </nav>
          </Card>
        </aside>
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
