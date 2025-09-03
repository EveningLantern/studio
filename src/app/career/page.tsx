
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { MapPin, Briefcase, Clock, Loader2 } from 'lucide-react';
import { ApplyModal } from '@/components/ApplyModal';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface JobOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
}

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
