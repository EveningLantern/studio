
'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, Image as ImageIcon, FileText, Trash2, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from './actions';
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

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Upload to Gallery'}
    </Button>
  );
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for editing dialog
  const [itemToEdit, setItemToEdit] = useState<GalleryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editHint, setEditHint] = useState('');

  const [formState, formAction] = useFormState(addGalleryItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);


  const fetchGalleryItems = async () => {
    setLoadingGallery(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch gallery items.',
      });
    } else {
      setGalleryItems(data as GalleryItem[]);
    }
    setLoadingGallery(false);
  };
  
  useEffect(() => {
    if (formState.message) {
      if (formState.message.includes('Success')) {
        toast({ title: 'Success!', description: 'Gallery item has been uploaded.' });
        formRef.current?.reset();
        fetchGalleryItems();
      } else {
        toast({ variant: 'destructive', title: 'Upload Failed', description: formState.message });
      }
    }
  }, [formState, toast]);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

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

  const handleDeleteClick = (item: GalleryItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const result = await deleteGalleryItem(itemToDelete.id, itemToDelete.image_url);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: result.error });
    } else {
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
    if (result.error) {
      toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
    } else {
      toast({ title: 'Success!', description: 'Gallery item has been updated.' });
      await fetchGalleryItems();
    }
    setIsUpdating(false);
    setItemToEdit(null);
  };

  const handleBlogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Info', description: 'Blog management is not yet implemented.' });
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
    <>
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
                       <form ref={formRef} action={formAction} className="space-y-6">
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
                        <SubmitButton />
                      </form>
                    </CardContent>
                  </Card>
                  <Card className="bg-transparent border-dashed mt-8">
                    <CardHeader>
                      <CardTitle>Existing Gallery Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingGallery ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                        </div>
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
                                 <p className="font-bold truncate">{item.title}</p>
                                 <p className="truncate">{item.hint}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                        {/* ... (Blog form remains unchanged) ... */}
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the gallery item and remove its image from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!itemToEdit} onOpenChange={() => setItemToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="edit-title">Image Title</Label>
                  <Input 
                      id="edit-title" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-input/50"
                      required 
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="edit-hint">Hover Description (Hint)</Label>
                  <Input 
                      id="edit-hint" 
                      value={editHint}
                      onChange={(e) => setEditHint(e.target.value)}
                      className="bg-input/50"
                      required
                  />
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="ghost" disabled={isUpdating}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                  </Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

    