import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of 5G in India: A Game Changer for Connectivity',
    date: 'October 26, 2023',
    author: 'Aarav Patel',
    excerpt: 'Explore how the rollout of 5G technology is set to revolutionize communication, IoT, and digital services across the Indian subcontinent.',
    imageUrl: 'https://picsum.photos/800/600?random=10',
    category: 'Telecom',
  },
  {
    id: 2,
    title: 'GIS in Urban Planning: Building Smarter Cities',
    date: 'October 22, 2023',
    author: 'Diya Mehta',
    excerpt: 'Geospatial Information Systems are not just for maps. Discover how GIS data is becoming the cornerstone of sustainable and efficient urban development.',
    imageUrl: 'https://picsum.photos/800/600?random=11',
    category: 'Geospatial',
  },
  {
    id: 3,
    title: 'Bridging the Digital Divide: Our Mission for Skill Development',
    date: 'October 18, 2023',
    author: 'Isha Gupta',
    excerpt: 'A look into our skill development initiatives that are empowering India\'s youth with the tools they need to thrive in the global tech economy.',
    imageUrl: 'https://picsum.photos/800/600?random=12',
    category: 'Skill Development',
  },
];


export default function BlogPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-center mb-16">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Digital Indian Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Insights, news, and articles on technology, infrastructure, and skill development from our team of experts.
        </p>
      </div>

      <div className="grid gap-12 max-w-7xl mx-auto">
        {blogPosts.map((post) => (
          <Card key={post.id} className="grid md:grid-cols-2 overflow-hidden bg-transparent transition-all duration-300 hover:shadow-glow">
             <div className="relative h-64 md:h-full">
              <Image
                src={post.imageUrl}
                alt={post.title}
                data-ai-hint="technology blog"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8">
              <CardHeader>
                <CardDescription className="text-primary font-semibold">{post.category}</CardDescription>
                <CardTitle className="font-headline text-2xl hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>
                  {post.date} by {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="link" className="text-primary p-0">
                    <Link href={`/blog/${post.id}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      <Footer />
    </div>
  );
}
