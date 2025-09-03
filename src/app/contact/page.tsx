'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CONTACT_DETAILS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';
import { sendContactEmail } from './actions';
import { useState } from 'react';
import mapImage from '../../assets/map.png';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await sendContactEmail(values);

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: "Thank you for contacting us. We'll get back to you shortly.",
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Send Message',
          description: result.message || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send Message',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Get In Touch
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We're here to help. Whether you have a question about our services or want to discuss a new project, feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 max-w-7xl mx-auto">
        {/* Contact Info */}
        <div className="lg:col-span-2">
            <Card className="h-full bg-transparent">
                <CardContent className="p-8">
                    <h2 className="font-headline text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-6 text-muted-foreground">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">Address</h3>
                                <p>{CONTACT_DETAILS.address}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">Phone</h3>
                                <p>{CONTACT_DETAILS.phone}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">Email</h3>
                                <p>{CONTACT_DETAILS.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Map Image */}
                    <div className="mt-8">
                        <Link
                            href="https://www.google.com/maps/place/EN+BLOCK,+EN+-+9,+EN+Block,+Sector+V,+Bidhannagar,+Kolkata,+West+Bengal+700091/@22.5736047,88.4314241,622m/data=!3m1!1e3!4m6!3m5!1s0x3a0275afb2dd949b:0xcaff4cf09f3240cf!8m2!3d22.5736058!4d88.43239!16s%2Fg%2F11rkm75qlp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition-transform hover:scale-105"
                        >
                            <Image
                                src={mapImage}
                                alt="Digital Indian Location Map - Click to view on Google Maps"
                                className="rounded-lg shadow-lg w-full cursor-pointer"
                                width={400}
                                height={300}
                                priority
                            />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <Card className="bg-transparent">
            <CardContent className="p-8">
              <h2 className="font-headline text-2xl font-bold mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-input/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-input/50"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Regarding Telecom Services" {...field} className="bg-input/50"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about your project or inquiry..."
                            className="min-h-[120px] bg-input/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
