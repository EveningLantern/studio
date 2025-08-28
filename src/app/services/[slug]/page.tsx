import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SERVICES } from '@/lib/constants';
import { CheckCircle } from 'lucide-react';
import { Footer } from '@/components/Footer';

type ServicePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = SERVICES.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const { details } = service;

  return (
    <article className="space-y-12">
      {/* Hero */}
      <section className="relative h-[40vh] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={details.heroImage}
          alt={details.heroTitle}
          data-ai-hint="service technology"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-center p-8 text-white md:p-12">
          <h1 className="font-headline text-3xl font-extrabold md:text-5xl">
            {details.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200">
            {details.heroSubtitle}
          </p>
        </div>
      </section>
      
      {/* Content Sections */}
      <div className="space-y-8 p-8">
        {details.sections.map((section, index) => (
          <div key={index}>
            <h2 className="font-headline text-2xl font-bold text-primary md:text-3xl">
              {section.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {section.content}
            </p>
            {section.points && (
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {section.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </article>
  );
}
