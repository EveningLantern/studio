import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const { details } = service;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-64 w-full">
        <Image
          src={details.heroImage}
          alt={details.heroTitle}
          data-ai-hint="service technology"
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-black/50 rounded-t-2xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-white">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
            {details.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200">
            {details.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="p-8 md:p-12">
        <div className="mx-auto max-w-4xl space-y-12">
          {details.sections.map((section, index) => (
            <div key={index}>
              <h2 className="font-headline text-3xl font-bold text-primary">
                {section.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {section.content}
              </p>
              {section.points && (
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-4">
                      <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
                      <span className="text-lg text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
