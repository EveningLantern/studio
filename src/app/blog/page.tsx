
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
  category: string;
  image_url: string;
  type: 'post';
}

interface CompanyUpdate {
  id: string;
  created_at: string;
  title: string;
  content: string;
  type: 'update';
}

type FeedItem = Post | CompanyUpdate;

export default function BlogPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchFeedItems = async () => {
      setLoading(true);
      
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*');

      if (postsError) {
        console.error('Error fetching posts:', postsError);
      }

      const { data: updates, error: updatesError } = await supabase
        .from('company_updates')
        .select('*');
      
      if (updatesError) {
        console.error('Error fetching updates:', updatesError);
      }

      const combinedFeed: FeedItem[] = [
        ...(posts || []).map(p => ({ ...p, type: 'post' as const })),
        ...(updates || []).map(u => ({ ...u, type: 'update' as const }))
      ];
      
      combinedFeed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setFeedItems(combinedFeed);
      setLoading(false);
    };

    fetchFeedItems();
  }, [supabase]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  const renderPost = (post: Post) => (
    <Card key={`post-${post.id}`} className="grid md:grid-cols-2 overflow-hidden bg-transparent transition-all duration-300 hover:shadow-glow">
       <div className="relative h-64 md:h-full">
        <Image
          src={post.image_url}
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
            {formatDate(post.created_at)} by {post.author}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {post.content}
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
  );

  const renderUpdate = (update: CompanyUpdate) => (
    <Card key={`update-${update.id}`} className="bg-card/70 border-primary/20 border-l-4 overflow-hidden transition-all duration-300 hover:shadow-glow">
      <div className="flex flex-col justify-center p-6">
        <CardHeader className="flex-row items-center gap-4">
          <Megaphone className="h-8 w-8 text-primary flex-shrink-0"/>
          <div>
            <CardTitle className="font-headline text-2xl">{update.title}</CardTitle>
            <CardDescription>{formatDate(update.created_at)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {update.content}
          </p>
        </CardContent>
      </div>
    </Card>
  );


  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="text-center mb-16">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
          Digital Indian Blog & Updates
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Insights, news, articles, and company announcements from our team of experts.
        </p>
      </div>

      <div className="grid gap-12 max-w-7xl mx-auto">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="grid md:grid-cols-2 overflow-hidden bg-transparent">
                <Skeleton className="h-64 md:h-full w-full" />
                <div className="flex flex-col justify-center p-8 space-y-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </Card>
            ))}
          </>
        ) : (
          feedItems.map((item) => (
            item.type === 'post' ? renderPost(item) : renderUpdate(item)
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}
