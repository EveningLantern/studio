
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
  const plugin = React.useRef(
    Autoplay({ delay: 200, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-4xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
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
                className="object-contain filter grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
