import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { MapPin, Briefcase, Clock } from 'lucide-react';

const jobOpenings = [
  {
    title: 'Senior Telecom Engineer',
    location: 'Bangalore, India',
    type: 'Full-time',
    department: 'Engineering',
    description: 'We are seeking an experienced Senior Telecom Engineer to design, implement, and optimize our next-generation wireless and fiber optic networks. The ideal candidate will have deep knowledge of 5G technologies and network architecture.'
  },
  {
    title: 'GIS Analyst',
    location: 'Remote',
    type: 'Full-time',
    department: 'Geospatial Services',
    description: 'Join our team of GIS experts to analyze spatial data and create insightful visualizations for our clients. Proficiency in ArcGIS, QGIS, and remote sensing technologies is required.'
  },
  {
    title: 'Business Development Manager',
    location: 'Mumbai, India',
    type: 'Full-time',
    department: 'Sales & Marketing',
    description: 'Drive our company\'s growth by identifying new business opportunities and building strong relationships with key clients in the technology and infrastructure sectors.'
  },
  {
    title: 'Lead Software Trainer',
    location: 'Hyderabad, India',
    type: 'Contract',
    department: 'Skill Development',
    description: 'We are looking for a passionate educator to lead our skill development bootcamps. Expertise in full-stack development (React, Node.js) and a talent for mentorship is a must.'
  }
];

export default function CareerPage() {
  return (
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
          {jobOpenings.map((job) => (
            <Card key={job.title} className="bg-transparent transition-all duration-300 hover:shadow-glow hover:bg-card/80">
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
                <Button className="bg-primary/90 hover:bg-primary">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
       <Footer />
    </div>
  );
}
