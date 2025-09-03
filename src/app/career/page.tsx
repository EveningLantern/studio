
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { MapPin, Briefcase, Clock, Loader2, Users, TrendingUp, Heart, Award, Target, Zap } from 'lucide-react';
import { ApplyModal } from '@/components/ApplyModal';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import group1 from '../../assets/group.jpg';
import group2 from '../../assets/carrer.jpg';

interface JobOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
}

const benefits = [
  {
    icon: <Users className="h-12 w-12 text-orange-500" />,
    title: "Collaborative Team",
    description: "Work with passionate professionals in a supportive and collaborative environment."
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-green-500" />,
    title: "Growth Opportunities",
    description: "Continuous learning and career advancement opportunities with cutting-edge technologies."
  },
  {
    icon: <Heart className="h-12 w-12 text-red-500" />,
    title: "Work-Life Balance",
    description: "Flexible work arrangements and a culture that values your well-being and personal time."
  },
  {
    icon: <Award className="h-12 w-12 text-blue-500" />,
    title: "Innovation Focus",
    description: "Be part of transformative projects that shape the future of technology in India."
  }
];

export default function CareerPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job openings:', error);
      } else {
        setJobOpenings(data as JobOpening[]);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [supabase]);

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore exciting career opportunities at Digital Indian and be a part of our growth story. We're looking for passionate individuals who want to shape the future of technology in India.
          </p>
        </div>

        {/* Why Join Us */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Join Digital Indian?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We offer exciting opportunities to work on transformative projects with the latest technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group text-center"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Life at Digital Indian */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Life at Digital Indian
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience our vibrant work culture, collaborative environment, and the amazing team that makes Digital Indian a great place to work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <Image
                  src={group1}
                  alt="Digital Indian Team - Group 1"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Collaborative Team Environment</h3>
                    <p className="text-sm">Working together to achieve excellence</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Image
                  src={group2}
                  alt="Digital Indian Team - Group 2"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Innovation & Growth</h3>
                    <p className="text-sm">Building the future of technology together</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Team Building</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Regular team events and activities that foster collaboration and build strong relationships.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Learning Culture</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Continuous learning opportunities with workshops, training sessions, and knowledge sharing.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Work-Life Balance</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Flexible work arrangements and a supportive environment that values your well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-12 max-w-4xl mx-auto">
          <h2 className="font-headline text-3xl font-bold text-primary text-center">Current Openings</h2>
          <div className="grid gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="bg-transparent">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                     <Skeleton className="h-10 w-28" />
                  </CardFooter>
                </Card>
              ))
            ) : jobOpenings.length > 0 ? (
                jobOpenings.map((job) => (
                <Card key={job.id} className="bg-transparent transition-all duration-300 hover:shadow-glow hover:bg-card/80">
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">{job.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{job.type}</span>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">
                        {job.description}
                    </p>
                    </CardContent>
                    <CardFooter>
                    <Button onClick={() => setSelectedJob(job.title)} className="bg-primary/90 hover:bg-primary">Apply Now</Button>
                    </CardFooter>
                </Card>
                ))
            ) : (
              <Card className="bg-transparent text-center p-8">
                <CardTitle>No Openings Currently</CardTitle>
                <CardDescription className="mt-2">
                  We are not actively hiring at the moment, but we are always interested in talented individuals. Please check back soon!
                </CardDescription>
              </Card>
            )}
          </div>
        </div>
         <Footer />
      </div>

      <ApplyModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        jobTitle={selectedJob || ''}
      />
    </>
  );
}
