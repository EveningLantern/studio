'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { PARTNERS } from '@/lib/constants';

export function PartnerCarousel() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 1000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full max-w-4xl"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent className="-ml-4">
        {PARTNERS.map((partner, index) => (
          <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
            <div className="flex aspect-video items-center justify-center p-6">
               <Image
                src={partner.logo}
                alt={partner.name}
                width={150}
                height={50}
                className="object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
