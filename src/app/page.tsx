"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { METRICS, TESTIMONIALS, SERVICES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PartnerCarousel } from "@/components/PartnerCarousel";

// ✅ Keep your hero images imports
import hero1 from "../assets/homet1.jpg";
import hero2 from "../assets/homet2.jpg";
import hero3 from "../assets/homet3.jpg";
import hero4 from "../assets/homet4.jpg";

declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

const images = [hero1, hero2, hero3, hero4];

export default function Home() {
  const [index, setIndex] = useState(0);

  // Rotate background every 5 seconds
  useEffect(() => {
  // ⏱️ Rotate background every 5 seconds
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, 5000);

  // 📜 Load particles.js
  const script = document.createElement("script");
  script.src = "/particles.js";
  script.async = true;
  script.onload = () => {
    if (window.particlesJS) {
      window.particlesJS.load("particles-js", "/particles.json", () => {
        console.log("particles.js config loaded");
      });
    }
  };
  document.body.appendChild(script);

  // 🧹 Cleanup
  return () => {
    clearInterval(interval);
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }

    // Destroy particles safely
    setTimeout(() => {
      if (
        window.pJSDom &&
        window.pJSDom.length > 0 &&
        window.pJSDom[0].fn &&
        window.pJSDom[0].fn.vendors &&
        typeof window.pJSDom[0].fn.vendors.destroypJS === "function"
      ) {
        window.pJSDom[0].fn.vendors.destroypJS();
        window.pJSDom = [];
      }
    }, 100);
  };
}, [images.length]);



  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full text-white overflow-hidden">
        {/* Fade transition images */}
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`Hero background ${i + 1}`}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Particles.js container - positioned only on the background image */}
        <div id="particles-js" className="absolute inset-0 z-10"></div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Transforming Business <span className="text-orange-400"> Technology Solutions</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200 md:text-xl">
            We deliver cutting-edge telecom infrastructure, GIS solutions, and
            professional development services that drive innovation and growth
            for businesses worldwide.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity"
            >
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
              Comprehensive technology solutions tailored to meet your business
              needs and drive digital transformation.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <Card
                key={service.slug}
                className="flex flex-col bg-transparent transition-all duration-300 hover:shadow-glow"
              >
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/20 p-3 text-primary">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-xl leading-tight">
                      {service.title}
                    </CardTitle>
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="max-w-3xl">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Trust & Expertise
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Decades of experience, hundreds of successful projects, and a
                network of trusted partners.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                {METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg p-6 glassmorphism transition-all duration-300 hover:shadow-glow"
                  >
                    <p className="font-headline text-4xl sm:text-5xl font-extrabold text-primary">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-base sm:text-lg font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg p-6 sm:p-8 glassmorphism transition-all duration-300 hover:shadow-glow">
              <h3 className="mb-6 sm:mb-8 text-center font-headline text-xl sm:text-2xl font-semibold text-muted-foreground">
                Our Partners and Affiliations
              </h3>
              <PartnerCarousel />
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
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
          >
            <CarouselContent>
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-1">
                    <Card className="h-full bg-transparent">
                      <CardContent className="flex h-full flex-col justify-center p-6 text-center">
                        <p className="mb-4 text-base sm:text-lg italic text-muted-foreground">
                          "{testimonial.quote}"
                        </p>
                        <p className="font-headline font-semibold">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.company}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex" />
            <CarouselNext className="hidden sm:inline-flex" />
          </Carousel>
        </div>
      </section>

      <Footer />
    </div>
  );
}
