
'use client';

import { useEffect, useState, useRef, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Image as ImageIcon, FileText, Trash2, Edit, Loader2, Send, Megaphone, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from './actions';
import { addPost, deletePost, updatePost, notifySubscribers, addUpdate, deleteUpdate, updateUpdate, notifySubscribersOfUpdate, addJobOpening, deleteJobOpening, updateJobOpening, notifySubscribersOfJob } from './blogActions';

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

interface CompanyUpdate {
    id: string;
    created_at: string;
    title: string;
    content: string;
}

interface JobOpening {
    id: string;
    created_at: string;
    title: string;
    location: string;
    type: string;
    department: string;
    description: string;
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
  const [isNotifyPending, startNotifyTransition] = useTransition();
  const [isNotifyUpdatePending, startNotifyUpdateTransition] = useTransition();
  const [isNotifyJobPending, startNotifyJobTransition] = useTransition();

  
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

  // Updates State
  const [updates, setUpdates] = useState<CompanyUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [updateToDelete, setUpdateToDelete] = useState<CompanyUpdate | null>(null);
  const [isDeletingUpdate, setIsDeletingUpdate] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState<CompanyUpdate | null>(null);
  const [isUpdatingUpdate, setIsUpdatingUpdate] = useState(false);
  const [editUpdateData, setEditUpdateData] = useState({ title: '', content: '' });
  const [updateFormState, updateFormAction] = useActionState(addUpdate, initialFormState);
  const updateFormRef = useRef<HTMLFormElement>(null);

  // Jobs State
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobToDelete, setJobToDelete] = useState<JobOpening | null>(null);
  const [isDeletingJob, setIsDeletingJob] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobOpening | null>(null);
  const [isUpdatingJob, setIsUpdatingJob] = useState(false);
  const [editJobData, setEditJobData] = useState({ title: '', location: '', type: '', department: '', description: '' });
  const [jobFormState, jobFormAction] = useActionState(addJobOpening, initialFormState);
  const jobFormRef = useRef<HTMLFormElement>(null);


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
  
  const fetchUpdates = async () => {
    setLoadingUpdates(true);
    const { data, error } = await supabase.from('company_updates').select('*').order('created_at', { ascending: false });
    if (error) toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch company updates.' });
    else setUpdates(data as CompanyUpdate[]);
    setLoadingUpdates(false);
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase.from('job_openings').select('*').order('created_at', { ascending: false });
    if (error) toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch job openings.' });
    else setJobs(data as JobOpening[]);
    setLoadingJobs(false);
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
    if (updateFormState.message) {
        if (updateFormState.message.includes('Success')) {
            toast({ title: 'Success!', description: 'Company update has been created.' });
            updateFormRef.current?.reset();
            fetchUpdates();
        } else {
            toast({ variant: 'destructive', title: 'Creation Failed', description: updateFormState.message });
        }
    }
  }, [updateFormState, toast]);

  useEffect(() => {
    if (jobFormState.message) {
        if (jobFormState.message.includes('Success')) {
            toast({ title: 'Success!', description: 'Job opening has been posted.' });
            jobFormRef.current?.reset();
            fetchJobs();
        } else {
            toast({ variant: 'destructive', title: 'Posting Failed', description: jobFormState.message });
        }
    }
  }, [jobFormState, toast]);


  useEffect(() => {
    fetchGalleryItems();
    fetchPosts();
    fetchUpdates();
    fetchJobs();
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

  const handleNotifySubscribers = (postId: string, postTitle: string) => {
    startNotifyTransition(async () => {
        toast({ title: 'Sending Notifications...', description: 'This may take a moment.'});
        const result = await notifySubscribers(postId, postTitle);
        if (result.success) {
            toast({ title: 'Notifications Sent!', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Notification Failed', description: result.message });
        }
    });
  };

  // Update Handlers
  const handleDeleteUpdateClick = (update: CompanyUpdate) => setUpdateToDelete(update);
  const handleConfirmDeleteUpdate = async () => {
    if (!updateToDelete) return;
    setIsDeletingUpdate(true);
    const result = await deleteUpdate(updateToDelete.id);
    if (result.error) toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Company update has been deleted.' });
      await fetchUpdates();
    }
    setIsDeletingUpdate(false);
    setUpdateToDelete(null);
  };

  const handleEditUpdateClick = (update: CompanyUpdate) => {
    setUpdateToEdit(update);
    setEditUpdateData({ title: update.title, content: update.content });
  };

  const handleUpdateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateToEdit) return;
    setIsUpdatingUpdate(true);
    const result = await updateUpdate(updateToEdit.id, editUpdateData);
    if (result.error) toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
    else {
      toast({ title: 'Success!', description: 'Company update has been updated.' });
      await fetchUpdates();
    }
    setIsUpdatingUpdate(false);
    setUpdateToEdit(null);
  };
  
  const handleNotifySubscribersOfUpdate = (updateId: string, updateTitle: string) => {
    startNotifyUpdateTransition(async () => {
        toast({ title: 'Sending Update Notifications...', description: 'This may take a moment.'});
        const result = await notifySubscribersOfUpdate(updateId, updateTitle);
        if (result.success) {
            toast({ title: 'Notifications Sent!', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Notification Failed', description: result.message });
        }
    });
  };

  // Job Handlers
  const handleDeleteJobClick = (job: JobOpening) => setJobToDelete(job);
  const handleConfirmDeleteJob = async () => {
      if (!jobToDelete) return;
      setIsDeletingJob(true);
      const result = await deleteJobOpening(jobToDelete.id);
      if (result.error) toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
      else {
          toast({ title: 'Success!', description: 'Job opening has been deleted.' });
          await fetchJobs();
      }
      setIsDeletingJob(false);
      setJobToDelete(null);
  };

  const handleEditJobClick = (job: JobOpening) => {
      setJobToEdit(job);
      setEditJobData({ title: job.title, location: job.location, type: job.type, department: job.department, description: job.description });
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!jobToEdit) return;
      setIsUpdatingJob(true);
      const result = await updateJobOpening(jobToEdit.id, editJobData);
      if (result.error) toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
      else {
          toast({ title: 'Success!', description: 'Job opening has been updated.' });
          await fetchJobs();
      }
      setIsUpdatingJob(false);
      setJobToEdit(null);
  };

  const handleNotifySubscribersOfJob = (jobId: string, jobTitle: string) => {
      startNotifyJobTransition(async () => {
          toast({ title: 'Sending Job Notifications...', description: 'This may take a moment.' });
          const result = await notifySubscribersOfJob(jobId, jobTitle);
          if (result.success) {
              toast({ title: 'Notifications Sent!', description: result.message });
          } else {
              toast({ variant: 'destructive', title: 'Notification Failed', description: result.message });
          }
      });
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="gallery"><ImageIcon className="mr-2 h-4 w-4" /> Manage Gallery</TabsTrigger>
                  <TabsTrigger value="blog"><FileText className="mr-2 h-4 w-4" /> Manage Blog</TabsTrigger>
                  <TabsTrigger value="updates"><Megaphone className="mr-2 h-4 w-4" />Company Updates</TabsTrigger>
                  <TabsTrigger value="jobs"><Briefcase className="mr-2 h-4 w-4" />Manage Jobs</TabsTrigger>
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
                        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
                      ) : (
                        <div className="space-y-4">
                          {posts.map(post => (
                            <div key={post.id} className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                              <div className="flex items-center gap-4">
                                <Image src={post.image_url} alt={post.title} width={80} height={60} className="rounded-md object-cover w-20 h-16" />
                                <div>
                                  <p className="font-bold">{post.title}</p>
                                  <p className="text-sm text-muted-foreground">{post.author} / {post.category}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleNotifySubscribers(post.id, post.title)} disabled={isNotifyPending}>
                                  {isNotifyPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                  Notify
                                </Button>
                                <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleEditPostClick(post)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDeletePostClick(post)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates" className="mt-6">
                   <Card className="bg-transparent border-dashed">
                    <CardHeader><CardTitle>Add New Company Update</CardTitle><CardDescription>Post a short update or announcement. It will appear on your blog page.</CardDescription></CardHeader>
                    <CardContent>
                       <form ref={updateFormRef} action={updateFormAction} className="space-y-6">
                        <div className="space-y-2"><Label htmlFor="update-title">Update Title</Label><Input id="update-title" name="title" placeholder="e.g., New Partnership Announcement" required className="bg-input/50"/></div>
                        <div className="space-y-2"><Label htmlFor="update-content">Content</Label><Textarea id="update-content" name="content" placeholder="Write your company update here..." required className="bg-input/50 min-h-[100px]"/></div>
                        <SubmitButton>Create Update</SubmitButton>
                      </form>
                    </CardContent>
                  </Card>
                  <Card className="bg-transparent border-dashed mt-8">
                    <CardHeader><CardTitle>Existing Company Updates</CardTitle></CardHeader>
                    <CardContent>
                      {loadingUpdates ? (
                        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
                      ) : (
                        <div className="space-y-4">
                          {updates.map(update => (
                            <div key={update.id} className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                <div>
                                  <p className="font-bold">{update.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{update.content}</p>
                                </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleNotifySubscribersOfUpdate(update.id, update.title)} disabled={isNotifyUpdatePending}>
                                    {isNotifyUpdatePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Notify
                                </Button>
                                <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleEditUpdateClick(update)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDeleteUpdateClick(update)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Jobs Tab */}
                <TabsContent value="jobs" className="mt-6">
                   <Card className="bg-transparent border-dashed">
                    <CardHeader><CardTitle>Create New Job Opening</CardTitle><CardDescription>Post a new job opportunity to your career page.</CardDescription></CardHeader>
                    <CardContent>
                       <form ref={jobFormRef} action={jobFormAction} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="job-title">Job Title</Label><Input id="job-title" name="title" placeholder="e.g., Senior Telecom Engineer" required className="bg-input/50"/></div>
                            <div className="space-y-2"><Label htmlFor="job-location">Location</Label><Input id="job-location" name="location" placeholder="e.g., Bangalore, India" required className="bg-input/50"/></div>
                            <div className="space-y-2"><Label htmlFor="job-type">Job Type</Label><Input id="job-type" name="type" placeholder="e.g., Full-time" required className="bg-input/50"/></div>
                            <div className="space-y-2"><Label htmlFor="job-department">Department</Label><Input id="job-department" name="department" placeholder="e.g., Engineering" required className="bg-input/50"/></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="job-description">Description</Label><Textarea id="job-description" name="description" placeholder="Describe the job role and requirements..." required className="bg-input/50 min-h-[100px]"/></div>
                        <SubmitButton>Create Job Opening</SubmitButton>
                      </form>
                    </CardContent>
                  </Card>
                  <Card className="bg-transparent border-dashed mt-8">
                    <CardHeader><CardTitle>Existing Job Openings</CardTitle></CardHeader>
                    <CardContent>
                      {loadingJobs ? (
                        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
                      ) : (
                        <div className="space-y-4">
                          {jobs.map(job => (
                            <div key={job.id} className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                                <div>
                                  <p className="font-bold">{job.title}</p>
                                  <p className="text-sm text-muted-foreground">{job.department} / {job.location}</p>
                                </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleNotifySubscribersOfJob(job.id, job.title)} disabled={isNotifyJobPending}>
                                    {isNotifyJobPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Notify
                                </Button>
                                <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => handleEditJobClick(job)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleDeleteJobClick(job)}><Trash2 className="h-4 w-4" /></Button>
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

      {/* Update Delete Dialog */}
      <AlertDialog open={!!updateToDelete} onOpenChange={() => setUpdateToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete this company update.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeletingUpdate}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeleteUpdate} disabled={isDeletingUpdate} className="bg-destructive hover:bg-destructive/90">{isDeletingUpdate ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      {/* Update Edit Dialog */}
      <Dialog open={!!updateToEdit} onOpenChange={() => setUpdateToEdit(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Company Update</DialogTitle></DialogHeader><form onSubmit={handleUpdateUpdate} className="space-y-4"><div className="space-y-2"><Label htmlFor="edit-update-title">Update Title</Label><Input id="edit-update-title" value={editUpdateData.title} onChange={(e) => setEditUpdateData({...editUpdateData, title: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-update-content">Content</Label><Textarea id="edit-update-content" value={editUpdateData.content} onChange={(e) => setEditUpdateData({...editUpdateData, content: e.target.value})} className="bg-input/50 min-h-[100px]" required /></div><DialogFooter><DialogClose asChild><Button type="button" variant="ghost" disabled={isUpdatingUpdate}>Cancel</Button></DialogClose><Button type="submit" disabled={isUpdatingUpdate}>{isUpdatingUpdate ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button></DialogFooter></form></DialogContent>
      </Dialog>

      {/* Job Delete Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete this job opening.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeletingJob}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeleteJob} disabled={isDeletingJob} className="bg-destructive hover:bg-destructive/90">{isDeletingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
      {/* Job Edit Dialog */}
      <Dialog open={!!jobToEdit} onOpenChange={() => setJobToEdit(null)}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Job Opening</DialogTitle></DialogHeader><form onSubmit={handleUpdateJob} className="space-y-4"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="edit-job-title">Job Title</Label><Input id="edit-job-title" value={editJobData.title} onChange={(e) => setEditJobData({...editJobData, title: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-job-location">Location</Label><Input id="edit-job-location" value={editJobData.location} onChange={(e) => setEditJobData({...editJobData, location: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-job-type">Job Type</Label><Input id="edit-job-type" value={editJobData.type} onChange={(e) => setEditJobData({...editJobData, type: e.target.value})} className="bg-input/50" required /></div><div className="space-y-2"><Label htmlFor="edit-job-department">Department</Label><Input id="edit-job-department" value={editJobData.department} onChange={(e) => setEditJobData({...editJobData, department: e.target.value})} className="bg-input/50" required /></div></div><div className="space-y-2"><Label htmlFor="edit-job-description">Description</Label><Textarea id="edit-job-description" value={editJobData.description} onChange={(e) => setEditJobData({...editJobData, description: e.target.value})} className="bg-input/50 min-h-[150px]" required /></div><DialogFooter><DialogClose asChild><Button type="button" variant="ghost" disabled={isUpdatingJob}>Cancel</Button></DialogClose><Button type="submit" disabled={isUpdatingJob}>{isUpdatingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button></DialogFooter></form></DialogContent>
      </Dialog>
    </>
  );
}
