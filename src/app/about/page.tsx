import Image from 'next/image';
import { TEAM_MEMBERS, SOCIAL_LINKS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import about from "../../assets/about.jpg";

export default function AboutPage() {
  return (
    <div className="bg-transparent">
      {/* Hero */}
      <section className="relative h-[50vh]">
        <Image
          src={about}
          alt="Our Team"
          data-ai-hint="team meeting"
          fill
          className="object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-t-2xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">About Digital Indian</h1>
          <p className="mt-4 max-w-3xl text-lg text-neutral-200">
          Leading the way in technology innovation with over 15 years of experience in delivering exceptional solutions across industries.
          </p>
        </div>
      </section>
      
      <div className="p-4 md:p-6 lg:p-8">
        {/* Mission & Vision */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary">Our Mission</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  To empower businesses and communities by engineering state-of-the-art technology solutions, fostering skill development, and providing strategic consultancy that drives sustainable growth and digital transformation across India.
                </p>
              </div>
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary">Our Vision</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  To be the leading catalyst in India's digital evolution, recognized for our commitment to innovation, quality, and creating a skilled, future-ready workforce that can compete on a global scale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore More About Us */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Explore More About Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mx-auto max-w-2xl">
              Connect with us on social media for the latest updates, insights, and behind-the-scenes content.
            </p>
            <div className="mt-8 flex justify-center gap-6">
  {SOCIAL_LINKS.map((social) => (
    <Button
      key={social.name}
      variant="ghost"
      asChild
      className="rounded-full hover:bg-primary/20 p-6 h-auto w-auto"
    >
      <Link
        href={social.href}
        aria-label={social.name}
        className="flex items-center justify-center"
      >
        {/* Force icon size here */}
        <social.icon className="text-primary w=40 h=40" />
      </Link>
    </Button>
  ))}
</div>



          </div>
        </section>

        {/* Team Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Meet Our Leadership
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The driving force behind our success is a team of passionate experts and visionary leaders.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_MEMBERS.map((member) => (
                <Card key={member.name} className="text-center bg-transparent transition-all duration-300 hover:shadow-glow">
                  <CardHeader className="items-center">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="professional headshot" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary">{member.role}</CardDescription>
                    <p className="mt-4 text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Join Our Journey
              </h2>
              <p className="mt-4 text-lg text-muted-foreground mx-auto max-w-2xl">
                Interested in our services or want to be a part of our team? We'd love to hear from you.
              </p>
              <div className="mt-8">
                  <Button asChild size="lg">
                      <Link href="/contact">Get In Touch</Link>
                  </Button>
              </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
