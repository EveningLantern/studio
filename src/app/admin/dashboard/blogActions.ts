
'use server';

import { createSupabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// Helper function to handle Supabase file upload
async function uploadFile(file: File, bucket: string) {
  const supabaseAdmin = createSupabaseAdmin();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) {
    console.error(`Storage Error in bucket ${bucket}:`, uploadError);
    return { data: null, error: `Failed to upload image to ${bucket}.` };
  }
  
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);
  
  if (!urlData.publicUrl) {
    return { data: null, error: 'Failed to get public URL for the image.' };
  }

  return { data: { url: urlData.publicUrl, fileName }, error: null };
}

// Action to add a new blog post
export async function addPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('image') as File;

  if (!title || !content || !author || !category || !imageFile || imageFile.size === 0) {
    return { message: 'All fields, including an image, are required.' };
  }

  const { data: uploadResult, error: uploadError } = await uploadFile(imageFile, 'posts');
  if (uploadError || !uploadResult) {
    return { message: uploadError };
  }

  const supabaseAdmin = createSupabaseAdmin();
  const { error: dbError } = await supabaseAdmin
    .from('posts')
    .insert([{ 
        title, 
        content, 
        author, 
        category, 
        image_url: uploadResult.url 
    }]);

  if (dbError) {
    console.error('Database Error:', dbError);
    return { message: 'Failed to save post to the database.' };
  }
  
  const result = { message: 'Success! Post created.' };

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return result;
}

// Action to delete a blog post
export async function deletePost(id: string, imageUrl: string) {
    const supabaseAdmin = createSupabaseAdmin();
    
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
        return { error: 'Could not determine file name from URL.' };
    }

    const { error: storageError } = await supabaseAdmin.storage
      .from('posts')
      .remove([fileName]);

    if (storageError) {
      console.error('Storage Deletion Error:', storageError);
    }

    const { error: dbError } = await supabaseAdmin
        .from('posts')
        .delete()
        .match({ id });

    if (dbError) {
        console.error('Database Deletion Error:', dbError);
        return { error: 'Failed to delete post from the database.' };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/blog');
    
    return { error: null };
}

// Action to update a blog post
export async function updatePost(id: string, postData: { title: string; content: string; author: string; category: string }) {
    const { title, content, author, category } = postData;
    if (!title || !content || !author || !category) {
        return { error: 'All fields are required.' };
    }
    
    const supabaseAdmin = createSupabaseAdmin();

    const { error } = await supabaseAdmin
        .from('posts')
        .update({ title, content, author, category })
        .match({ id });

    if (error) {
        console.error('Database Update Error:', error);
        return { error: 'Failed to update post.' };
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`); // Assuming a dynamic route for single posts exists or will exist

    return { error: null };
}

    
