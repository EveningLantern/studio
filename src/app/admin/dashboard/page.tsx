
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Image as ImageIcon, FileText, Trash2, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from './actions';
import { addPost, deletePost, updatePost } from './blogActions';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface GalleryItem {
    id: string;
    title: string;
    hint: string;
    image_url: string;
}
interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    image_url: string;
}

const initialFormState = { message: '' };

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : children}
    </Button>
  );
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();
  
  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GalleryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editHint, setEditHint] = useState('');
  const [galleryFormState, galleryFormAction] = useActionState(addGalleryItem, initialFormState);
  const galleryFormRef = useRef<HTMLFormElement>(null);

  // Blog State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [editPostData, setEditPostData] = useState({ title: '', content: '', author: '', category: '' });
  const [blogFormState, blogFormAction] = useActionState(addPost, initialFormState);
  const blogFormRef = useRef<HTMLFormElement>(null);


  // Fetching Data
  const fetchGalleryItems = async () => {
    setLoadingGallery(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch gallery items.' });
    else setGalleryItems(data as GalleryItem[]);
    setLoadingGallery(false);
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch blog posts.' });
    else setPosts(data as Post[]);
    setLoadingPosts(false);
  };
  
  // Form State Effects
  useEffect(() => {
    if (galleryFormState.message) {
      if (galleryFormState.message.includes('Success')) {
        toast({ title: 'Success!', description: 'Gallery item has been uploaded.' });
        galleryFormRef.current?.reset();
        fetchGalleryItems();
      } else {
        toast({ variant: 'destructive', title: 'Upload Failed', description: galleryFormState.message });
      }
    }
  }, [galleryFormState, toast]);

  useEffect(() => {
    if (blogFormState.message) {
        if (blogFormState.message.includes('Success')) {
            toast({ title: 'Success!', description: 'Blog post has been created.' });
            blogFormRef.current?.reset();
            fetchPosts();
        } else {
            toast({ variant: 'destructive', title: 'Creation Failed', description: blogFormState.message });
        }
    }
  }, [blogFormState, toast]);


  useEffect(() => {
    fetchGalleryItems();
    fetchPosts();
  }, []);

  // Auth Effect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.push('/admin/login');
      else setUser(session.user);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  // Handlers
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/admin/login');
  };

  // Gallery Handlers
  const handleDeleteClick = (item: GalleryItem) => setItemToDelete(item);
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const result = await deleteGalleryItem(itemToDelete.id, itemToDelete.image_url);
    if (result.error) toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Gallery item has been deleted.' });
      await fetchGalleryItems();
    }
    setIsDeleting(false);
    setItemToDelete(null);
  };
  
  const handleEditClick = (item: GalleryItem) => {
    setItemToEdit(item);
    setEditTitle(item.title);
    setEditHint(item.hint);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;
    setIsUpdating(true);
    const result = await updateGalleryItem(itemToEdit.id, editTitle, editHint);
    if (result.error) toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Gallery item has been updated.' });
      await fetchGalleryItems();
    }
    setIsUpdating(false);
    setItemToEdit(null);
  };

  // Blog Handlers
  const handleDeletePostClick = (post: Post) => setPostToDelete(post);
  const handleConfirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeletingPost(true);
    const result = await deletePost(postToDelete.id, postToDelete.image_url);
    if (result.error) toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Blog post has been deleted.' });
      await fetchPosts();
    }
    setIsDeletingPost(false);
    setPostToDelete(null);
  };

  const handleEditPostClick = (post: Post) => {
    setPostToEdit(post);
    setEditPostData({ title: post.title, content: post.content, author: post.author, category: post.category });
  };
  
  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postToEdit) return;
    setIsUpdatingPost(true);
    const result = await updatePost(postToEdit.id, editPostData);
    if (result.error) toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Blog post has been updated.' });
      await fetchPosts();
    }
    setIsUpdatingPost(false);
    setPostToEdit(null);
  };

  if (loading) {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-64 mb-8" />
                <Card className="bg-transparent"><CardHeader><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-full" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
              <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
              <Button onClick={handleLogout} variant="destructive"><LogOut className="mr-2 h-4 w-4" />Logout</Button>
          </div>
          
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle>Welcome, {user?.email || 'Admin'}!</CardTitle>
              <CardDescription>Use the tabs below to manage your website's content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gallery"><ImageIcon className="mr-2 h-4 w-4" /> Manage Gallery</TabsTrigger>
                  <TabsTrigger value="blog"><FileText className="mr-2 h-4 w-4" /> Manage Blog</TabsTrigger>
                </TabsList>
                {/* Gallery Tab */}
                <TabsContent value="gallery" className="mt-6">
                  <Card className="bg-transparent border-dashed">
                    <CardHeader><CardTitle>Upload New Gallery Image</CardTitle><CardDescription>Add a new image to your gallery page.</CardDescription></CardHeader>
                    <CardContent>
                       <form ref={galleryFormRef} action={galleryFormAction} className="space-y-6">
                        <div className="space-y-2"><Label htmlFor="gallery-image">Image File</Label><Input id="gallery-image" name="image" type="file" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="gallery-title">Image Title</Label><Input id="gallery-title" name="title" placeholder="e.g., Our Bangalore HQ" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="gallery-hint">Hover Description (Hint)</Label><Input id="gallery-hint" name="hint" placeholder="e.g., office workspace" required className="bg-input/50"/></div>
                        <SubmitButton>Upload to Gallery</SubmitButton>
                      </form>
                    </CardContent>
                  </Card>
                  <Card className="bg-transparent border-dashed mt-8">
                    <CardHeader><CardTitle>Existing Gallery Items</CardTitle></CardHeader>
                    <CardContent>
                      {loadingGallery ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {galleryItems.map(item => (
                            <div key={item.id} className="relative group">
                              <Image src={item.image_url} alt={item.title} width={200} height={200} className="rounded-md object-cover w-full h-32" />
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs rounded-b-md">
                                 <p className="font-bold truncate">{item.title}</p><p className="truncate">{item.hint}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Blog Tab */}
                <TabsContent value="blog" className="mt-6">
                   <Card className="bg-transparent border-dashed">
                    <CardHeader><CardTitle>Create New Blog Post</CardTitle><CardDescription>Write a new blog post. It will appear on your blog page.</CardDescription></CardHeader>
                    <CardContent>
                       <form ref={blogFormRef} action={blogFormAction} className="space-y-6">
                        <div className="space-y-2"><Label htmlFor="post-image">Thumbnail Image</Label><Input id="post-image" name="image" type="file" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="post-title">Post Title</Label><Input id="post-title" name="title" placeholder="e.g., The Future of AI" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="post-author">Author</Label><Input id="post-author" name="author" placeholder="e.g., John Doe" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="post-category">Category</Label><Input id="post-category" name="category" placeholder="e.g., Technology" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="post-content">Content</Label><Textarea id="post-content" name="content" placeholder="Write your blog post here..." required className="bg-input/50 min-h-[150px]"/></div>
                        <SubmitButton>Create Post</SubmitButton>
                      </form>
                    </CardContent>
                  </Card>
                  <Card className="bg-transparent border-dashed mt-8">
                    <CardHeader><CardTitle>Existing Blog Posts</CardTitle></CardHeader>
                    <CardContent>
                      {loadingPosts ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {posts.map(post => (
                            <div key={post.id} className="relative group">
                              <Image src={post.image_url} alt={post.title} width={400} height={300} className="rounded-md object-cover w-full h-48" />
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleEditPostClick(post)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeletePostClick(post)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs rounded-b-md">
                                 <p className="font-bold truncate">{post.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Gallery Delete Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the gallery item and remove its image.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">{isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      {/* Gallery Edit Dialog */}
      <Dialog open={!!itemToEdit} onOpenChange={() => setItemToEdit(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Gallery Item</DialogTitle></DialogHeader><form onSubmit={handleUpdateItem} className="space-y-4"><div className="space-y-2"><Label htmlFor="edit-title">Image Title</Label><Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-hint">Hover Description (Hint)</Label><Input id="edit-hint" value={editHint} onChange={(e) => setEditHint(e.target.value)} className="bg-input/50" required /></div><DialogFooter><DialogClose asChild><Button type="button" variant="ghost" disabled={isUpdating}>Cancel</Button></DialogClose><Button type="submit" disabled={isUpdating}>{isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button></DialogFooter></form></DialogContent>
      </Dialog>

      {/* Blog Delete Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the blog post and its thumbnail image.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeletingPost}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeletePost} disabled={isDeletingPost} className="bg-destructive hover:bg-destructive/90">{isDeletingPost ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      {/* Blog Edit Dialog */}
      <Dialog open={!!postToEdit} onOpenChange={() => setPostToEdit(null)}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Blog Post</DialogTitle></DialogHeader><form onSubmit={handleUpdatePost} className="space-y-4"><div className="space-y-2"><Label htmlFor="edit-post-title">Post Title</Label><Input id="edit-post-title" value={editPostData.title} onChange={(e) => setEditPostData({...editPostData, title: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-post-author">Author</Label><Input id="edit-post-author" value={editPostData.author} onChange={(e) => setEditPostData({...editPostData, author: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-post-category">Category</Label><Input id="edit-post-category" value={editPostData.category} onChange={(e) => setEditPostData({...editPostData, category: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-post-content">Content</Label><Textarea id="edit-post-content" value={editPostData.content} onChange={(e) => setEditPostData({...editPostData, content: e.target.value})} className="bg-input/50 min-h-[200px]" required /></div><DialogFooter><DialogClose asChild><Button type="button" variant="ghost" disabled={isUpdatingPost}>Cancel</Button></DialogClose><Button type="submit" disabled={isUpdatingPost}>{isUpdatingPost ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button></DialogFooter></form></DialogContent>
      </Dialog>
    </>
  );
}
