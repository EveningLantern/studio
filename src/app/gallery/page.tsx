import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function GalleryPage() {
  return (
    <div className="container mx-auto max-w-7xl py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A visual journey through our projects and team events.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={`https://picsum.photos/600/400?random=${item}`}
                alt={`Gallery image ${item}`}
                data-ai-hint="company event"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
