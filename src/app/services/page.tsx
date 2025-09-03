
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICES } from '@/lib/constants';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Our Core Services
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Comprehensive technology solutions designed to transform your business operations and drive sustainable growth.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {SERVICES.map((service) => (
            <AccordionItem value={service.slug} key={service.slug} className="bg-transparent border-none rounded-lg glassmorphism">
              <AccordionTrigger className="p-6 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20 text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="border-t">
                  <div className="relative h-48 w-full">
                     <Image
                      src={service.details.heroImage}
                      alt={service.details.heroTitle}
                      data-ai-hint="service technology"
                      fill
                      className="object-cover"
                    />
                     <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="p-6 space-y-6">
                    {service.details.sections.map((section, index) => (
                      <div key={index}>
                        <h4 className="font-headline text-lg font-bold text-primary">
                          {section.title}
                        </h4>
                        <p className="mt-2 text-muted-foreground">
                          {section.content}
                        </p>
                        {section.points && (
                          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
