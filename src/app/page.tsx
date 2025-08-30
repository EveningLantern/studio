
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { METRICS, PARTNERS, TESTIMONIALS, SERVICES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full text-white">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Collaboration in a modern office"
          data-ai-hint="technology collaboration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Engineering the Digital Future
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200 md:text-xl">
            Your trusted partner in building robust telecom infrastructure, leveraging geospatial insights, and empowering businesses.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Our Core Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide comprehensive solutions to drive growth and innovation in the digital age.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <Card key={service.slug} className="flex flex-col bg-transparent transition-all duration-300 hover:shadow-glow">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/20 p-3 text-primary">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-xl leading-tight">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                   <Button asChild variant="link" className="text-primary p-0">
                    <Link href={`/services/${service.slug}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Expertise Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Trust & Expertise
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Decades of experience, hundreds of successful projects, and a network of trusted partners.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-lg p-8 glassmorphism transition-all duration-300 hover:shadow-glow">
                <p className="font-headline text-5xl font-extrabold text-primary">{metric.value}</p>
                <p className="mt-2 text-lg font-medium text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <h3 className="mb-8 text-center font-headline text-2xl font-semibold text-muted-foreground">
              Our Partners
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="flex items-center" title={partner.name}>
                   <Image src={partner.logoUrl} alt={partner.name} width={150} height={50} className="object-contain filter grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What Our Clients Say
            </h2>
          </div>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-1">
                    <Card className="h-full bg-transparent">
                      <CardContent className="flex h-full flex-col justify-center p-6 text-center">
                        <p className="mb-4 text-lg italic text-muted-foreground">
                          "{testimonial.quote}"
                        </p>
                        <p className="font-headline font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <Footer />
    </div>
  );
}
