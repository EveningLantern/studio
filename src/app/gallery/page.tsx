
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface GalleryItem {
  id: string;
  title: string;
  hint: string;
  image_url: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery items:', error);
      } else {
        setGalleryItems(data as GalleryItem[]);
      }
      setLoading(false);
    };

    fetchGalleryItems();
  }, []);

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

      {loading ? (
         <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
            {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
            ))}
         </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="overflow-hidden rounded-lg break-inside-avoid group relative cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <Image
                src={item.image_url}
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
      )}

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl glassmorphism p-4">
                 <div className="relative w-full aspect-video">
                     <Image 
                        src={selectedImage.image_url} 
                        alt={selectedImage.title} 
                        fill 
                        className="object-contain rounded-md"
                     />
                 </div>
                 <div className="pt-2">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{selectedImage.title}</DialogTitle>
                        <DialogDescription className="text-base text-foreground/90">
                            {selectedImage.hint}
                        </DialogDescription>
                    </DialogHeader>
                 </div>
            </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
}
