
'use server';

import { createSupabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addGalleryItem(formData: FormData) {
  const title = formData.get('title') as string;
  const hint = formData.get('hint') as string;
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Please provide an image file.' };
  }

  const supabaseAdmin = createSupabaseAdmin();
  const fileExtension = imageFile.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  // Upload the file to storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('gallery')
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('Storage Error:', uploadError);
    return { error: 'Failed to upload image to storage.' };
  }
  
  // Get the public URL of the uploaded file
  const { data: urlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(fileName);
  const imageUrl = urlData.publicUrl;

  if (!imageUrl) {
    return { error: 'Failed to get public URL for the image.' };
  }

  // Insert the record into the database
  const { error: dbError } = await supabaseAdmin
    .from('gallery')
    .insert([{ title, hint, image_url: imageUrl }]);

  if (dbError) {
    console.error('Database Error:', dbError);
    return { error: 'Failed to save gallery item to the database.' };
  }

  // Revalidate paths to refresh the cache
  revalidatePath('/admin/dashboard');
  revalidatePath('/gallery');

  return { error: null };
}
