
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// This function creates a Supabase client for server-side operations
function createSupabaseAdminClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: CookieOptions) {
          (await cookieStore).set({ name, value: '', ...options })
        },
      },
    }
  );
}


export async function addGalleryItem(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const hint = formData.get('hint') as string;
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { message: 'Please provide an image file.' };
  }
   if (!title || !hint) {
    return { message: 'Title and hint are required.' };
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const fileExtension = imageFile.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  // Upload the file to storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('gallery')
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('Storage Error:', uploadError);
    return { message: 'Failed to upload image to storage.' };
  }
  
  // Get the public URL of the uploaded file
  const { data: urlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(fileName);
  const imageUrl = urlData.publicUrl;

  if (!imageUrl) {
    return { message: 'Failed to get public URL for the image.' };
  }

  // Insert the record into the database
  const { error: dbError } = await supabaseAdmin
    .from('gallery')
    .insert([{ title, hint, image_url: imageUrl }]);

  if (dbError) {
    console.error('Database Error:', dbError);
    return { message: 'Failed to save gallery item to the database.' };
  }

  const result = { message: 'Success!' };

  revalidatePath('/admin/dashboard');
  revalidatePath('/gallery');
  
  return result;
}

export async function deleteGalleryItem(id: string, imageUrl: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    
    // Extract file name from URL
    const fileName = imageUrl.split('/').pop();

    if (!fileName) {
        return { error: 'Could not determine file name from URL.' };
    }

    // 1. Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('gallery')
      .remove([fileName]);

    if (storageError) {
      console.error('Storage Deletion Error:', storageError);
      // We can choose to continue even if storage deletion fails, to remove the db record.
    }

    // 2. Delete from database
    const { error: dbError } = await supabaseAdmin
        .from('gallery')
        .delete()
        .match({ id });

    if (dbError) {
        console.error('Database Deletion Error:', dbError);
        return { error: 'Failed to delete gallery item from the database.' };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');
    
    return { error: null };
}

export async function updateGalleryItem(id: string, title: string, hint: string) {
    if (!title || !hint) {
        return { error: 'Title and hint cannot be empty.' };
    }
    
    const supabaseAdmin = createSupabaseAdminClient();

    const { error } = await supabaseAdmin
        .from('gallery')
        .update({ title, hint })
        .match({ id });

    if (error) {
        console.error('Database Update Error:', error);
        return { error: 'Failed to update gallery item.' };
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/gallery');

    return { error: null };
}

    
