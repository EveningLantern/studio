import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

const galleryItems = [
  { id: 1, src: 'https://picsum.photos/600/400?random=21', hint: 'office workspace', title: 'Our Bangalore HQ' },
  { id: 2, src: 'https://picsum.photos/600/800?random=22', hint: 'team collaboration', title: 'Strategy Session' },
  { id: 3, src: 'https://picsum.photos/800/600?random=23', hint: 'telecom tower', title: '5G Tower Inspection' },
  { id: 4, src: 'https://picsum.photos/600/400?random=24', hint: 'training session', title: 'Skill Development Workshop' },
  { id: 5, src: 'https://picsum.photos/800/600?random=25', hint: 'data visualization', title: 'GIS Data Analysis' },
  { id: 6, src: 'https://picsum.photos/600/800?random=26', hint: 'company event', title: 'Annual Tech Summit' },
  { id: 7, src: 'https://picsum.photos/600/400?random=27', hint: 'client meeting', title: 'Client Partnership' },
  { id: 8, src: 'https://picsum.photos/800/600?random=28', hint: 'network infrastructure', title: 'Fiber Optics Deployment' },
  { id: 9, src: 'https://picsum.photos/600/400?random=29', hint: 'community outreach', title: 'Community Program' },
]

export default function GalleryPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-center mb-16">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Our Gallery
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A visual journey through our projects, team culture, and the impact we're making.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
        {galleryItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg break-inside-avoid group relative">
            <Image
              src={item.src}
              alt={item.title}
              data-ai-hint={item.hint}
              width={800}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <h3 className="text-white font-headline text-lg">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
