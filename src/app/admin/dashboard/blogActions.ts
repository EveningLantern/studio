
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// This function creates a Supabase client for server-side operations that require user context (cookies)
function createSupabaseServerClient() {
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

// This function creates a Supabase client with full admin privileges for server-side operations
// that are not tied to a specific user's request, like fetching all subscribers.
function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// ✅ File upload helper
async function uploadFile(file: File, bucket: string) {
  const supabase = createSupabaseServerClient(); // Use server client for user-context actions
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) {
    console.error(`❌ Storage upload error [${bucket}]:`, uploadError);
    return { data: null, error: `Failed to upload image to ${bucket}.` };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (!urlData.publicUrl) {
    return { data: null, error: 'Failed to get public URL for the image.' };
  }

  return { data: { url: urlData.publicUrl, fileName }, error: null };
}

// ✅ Send new post email notifications
export async function notifySubscribers(postId: string, postTitle: string) {
  const { EMAIL_USER, EMAIL_PASS, NEXT_PUBLIC_BASE_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in env.');
    return { success: false, message: 'Server email configuration is incomplete.' };
  }
  if (!NEXT_PUBLIC_BASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_BASE_URL in env.');
    return { success: false, message: 'Base URL is not configured.' };
  }

  const supabaseAdmin = createSupabaseAdminClient(); // Use the direct admin client
  const { data: subscribers, error } = await supabaseAdmin
    .from('subscriptions')
    .select('email');

  if (error) {
    console.error('❌ Failed to fetch subscribers:', error);
    return { success: false, message: 'Could not fetch subscribers.' };
  }
  if (!subscribers || subscribers.length === 0) {
    console.warn('⚠️ No subscribers found. No emails will be sent.');
    return { success: true, message: 'No subscribers to notify.' };
  }

  console.log(`📧 Sending notification to ${subscribers.length} subscribers...`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, // must be Gmail App Password
    },
  });

  const postUrl = `${NEXT_PUBLIC_BASE_URL}/blog/${postId}`;
  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: `New Blog Post: ${postTitle}`,
        html: `
          <h1>New Post on Digital Indian Blog</h1>
          <p>We've just published "<strong>${postTitle}</strong>".</p>
          <a href="${postUrl}" 
             style="display:inline-block;padding:10px 20px;color:white;
                    background-color:#f97316;text-decoration:none;
                    border-radius:5px;">
            Read Now
          </a>
          <p>Or copy this link: ${postUrl}</p>
          <br>
          <p>Best,<br>The Digital Indian Team</p>
        `,
      });
      sentCount++;
      console.log(`✅ Email sent to ${subscriber.email}`);
    } catch (err) {
      failedCount++;
      console.error(`❌ Failed to send email to ${subscriber.email}:`, err);
    }
  }

  console.log(`🎉 Finished sending notifications. Sent: ${sentCount}, Failed: ${failedCount}`);
  return { success: true, message: `Notifications sent to ${sentCount} subscribers. ${failedCount > 0 ? `${failedCount} failed.` : ''}` };
}

// ✅ Add new post
export async function addPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('image') as File;

  if (!title || !content || !author || !category || !imageFile || imageFile.size === 0) {
    return { message: 'All fields including image are required.' };
  }

  const { data: uploadResult, error: uploadError } = await uploadFile(imageFile, 'posts');
  if (uploadError || !uploadResult) {
    return { message: uploadError };
  }

  const supabase = createSupabaseServerClient();
  const { data: postData, error: dbError } = await supabase
    .from('posts')
    .insert([{ title, content, author, category, image_url: uploadResult.url }])
    .select()
    .single();

  if (dbError) {
    console.error('❌ Database insert error:', dbError);
    return { message: 'Failed to save post to DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  // IMPORTANT: We no longer send emails automatically. This is now a manual admin action.
  return { message: '✅ Success! Post created. You can now notify subscribers.' };
}

// ✅ Delete post
export async function deletePost(id: string, imageUrl: string) {
  const supabase = createSupabaseServerClient();

  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    const { error: storageError } = await supabase.storage.from('posts').remove([fileName]);
    if (storageError) console.error('❌ Storage deletion error:', storageError);
  }

  const { error: dbError } = await supabase.from('posts').delete().match({ id });
  if (dbError) {
    console.error('❌ DB deletion error:', dbError);
    return { error: 'Failed to delete post from DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return { error: null };
}

// ✅ Update post
export async function updatePost(
  id: string,
  postData: { title: string; content: string; author: string; category: string }
) {
  const { title, content, author, category } = postData;
  if (!title || !content || !author || !category) {
    return { error: 'All fields required.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('posts')
    .update({ title, content, author, category })
    .match({ id });

  if (error) {
    console.error('❌ DB update error:', error);
    return { error: 'Failed to update post.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);

  return { error: null };
}
