
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from 'react';

interface PostPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-96 w-full">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          className="object-cover rounded-t-2xl"
          priority
        />
        <div className="absolute inset-0 bg-black/50 rounded-t-2xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 text-center text-white">
          <p className="font-semibold text-primary">{post.category}</p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl max-w-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-neutral-200">
            By {post.author} on {formatDate(post.created_at)}
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        <article className="prose prose-lg dark:prose-invert max-w-none text-foreground text-xl leading-relaxed space-y-6">
            {post.content.split('\n').map((paragraph: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                <p key={index}>{paragraph}</p>
            ))}
        </article>

        <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Link>
            </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
