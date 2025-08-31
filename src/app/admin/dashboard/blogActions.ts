
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// This function creates a Supabase client for server-side operations
function createSupabaseAdminClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  );
}

// Helper function to handle Supabase file upload
async function uploadFile(file: File, bucket: string) {
  const supabaseAdmin = createSupabaseAdminClient();
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

// Helper function to send notification emails
async function sendNewPostNotification(post: { id: string; title: string; }) {
  const { EMAIL_USER, EMAIL_PASS, NEXT_PUBLIC_BASE_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Email credentials are not set. Cannot send post notifications.');
      return;
  }
  if (!NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not set. Cannot create post links for emails.');
      return;
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: subscribers, error } = await supabaseAdmin.from('subscriptions').select('email');

  if (error || !subscribers || subscribers.length === 0) {
      console.error('Could not fetch subscribers or no subscribers to notify.', error);
      return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
  });

  const postUrl = `${NEXT_PUBLIC_BASE_URL}/blog/${post.id}`;
  
  const emailPromises = subscribers.map(subscriber => {
    const mailOptions = {
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: `New Blog Post: ${post.title}`,
        html: `
            <h1>New Post on Digital Indian Blog</h1>
            <p>We've just published a new article titled "<strong>${post.title}</strong>".</p>
            <p>We think you'll find it interesting!</p>
            <a href="${postUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #f97316; text-decoration: none; border-radius: 5px;">Read Now</a>
            <br>
            <p>Or copy and paste this link into your browser: ${postUrl}</p>
            <br>
            <p>Best regards,<br>The Digital Indian Team</p>
        `,
    };
    return transporter.sendMail(mailOptions).catch(err => {
      console.error(`Failed to send email to ${subscriber.email}:`, err);
      // Return null or a specific error object if you want to track failures
      return null;
    });
  });

  try {
    const results = await Promise.all(emailPromises);
    const successfulSends = results.filter(result => result !== null).length;
    console.log(`New post notifications sent to ${successfulSends} out of ${subscribers.length} subscribers.`);
  } catch (e) {
    console.error('An error occurred while sending notification emails:', e);
  }
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

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: postData, error: dbError } = await supabaseAdmin
    .from('posts')
    .insert([{ 
        title, 
        content, 
        author, 
        category, 
        image_url: uploadResult.url 
    }])
    .select()
    .single();

  if (dbError) {
    console.error('Database Error:', dbError);
    return { message: 'Failed to save post to the database.' };
  }
  
  // Send notifications but don't block response
  if (postData) {
    sendNewPostNotification(postData);
  }
  
  const result = { message: 'Success! Post created.' };

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return result;
}

// Action to delete a blog post
export async function deletePost(id: string, imageUrl: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    
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
    
    const supabaseAdmin = createSupabaseAdminClient();

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
