
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
      });
    } else {
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/admin/login');
    }
  };

  const handleGallerySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Gallery submission:', data);
    toast({
      title: 'Submission Received',
      description: 'Gallery item has been submitted for processing.',
    });
    e.currentTarget.reset();
  };

  const handleBlogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log('Blog submission:', data);
    toast({
      title: 'Submission Received',
      description: 'Blog post has been submitted for processing.',
    });
    e.currentTarget.reset();
  };


  if (loading) {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <Card className="bg-transparent">
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
         </div>
        
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Welcome, {user?.email || 'Admin'}!</CardTitle>
            <CardDescription>
              Use the tabs below to manage your website's content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gallery"><ImageIcon className="mr-2 h-4 w-4" /> Manage Gallery</TabsTrigger>
                <TabsTrigger value="blog"><FileText className="mr-2 h-4 w-4" /> Manage Blog</TabsTrigger>
              </TabsList>
              <TabsContent value="gallery" className="mt-6">
                <Card className="bg-transparent border-dashed">
                  <CardHeader>
                    <CardTitle>Upload New Gallery Image</CardTitle>
                    <CardDescription>Add a new image to your gallery page.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGallerySubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="gallery-image">Image File</Label>
                        <Input id="gallery-image" name="image" type="file" required className="bg-input/50"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gallery-title">Image Title</Label>
                        <Input id="gallery-title" name="title" placeholder="e.g., Our Bangalore HQ" required className="bg-input/50"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gallery-hint">Hover Description (Hint)</Label>
                        <Input id="gallery-hint" name="hint" placeholder="e.g., office workspace" required className="bg-input/50"/>
                      </div>
                      <Button type="submit">Upload to Gallery</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blog" className="mt-6">
                <Card className="bg-transparent border-dashed">
                  <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                    <CardDescription>
                      Write a new blog post or company update. It will appear on your blog page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBlogSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="blog-title">Post Title</Label>
                        <Input id="blog-title" name="title" placeholder="The Future of 5G in India" required className="bg-input/50"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-category">Category</Label>
                        <Input id="blog-category" name="category" placeholder="e.g., Telecom, Company Update" required className="bg-input/50"/>
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="blog-author">Author</Label>
                        <Input id="blog-author" name="author" placeholder="John Doe" required className="bg-input/50"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-excerpt">Content / Excerpt</Label>
                        <Textarea id="blog-excerpt" name="excerpt" placeholder="Write the main content of your post here..." required className="bg-input/50 min-h-[150px]"/>
                      </div>
                      <Button type="submit">Publish Post</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
