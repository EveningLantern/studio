import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function CareerPage() {
  const jobOpenings = [
    {
      title: 'Senior Telecom Engineer',
      location: 'Bangalore, India',
      type: 'Full-time',
    },
    {
      title: 'GIS Analyst',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Business Development Manager',
      location: 'Mumbai, India',
      type: 'Full-time',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Join Our Team
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore exciting career opportunities at Digital Indian and be a part of our growth story.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="font-headline text-3xl font-bold text-primary">Current Openings</h2>
        <div className="grid gap-6">
          {jobOpenings.map((job) => (
            <Card key={job.title}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.location} - {job.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We are looking for a passionate individual to join our team. Click to learn more and apply.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
