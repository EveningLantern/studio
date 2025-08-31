'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// ✅ Create Supabase client with Service Role Key
function createSupabaseAdminClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // must be server-only key
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          (await cookieStore).set({ name, value: '', ...options });
        },
      },
    }
  );
}

// ✅ File upload helper
async function uploadFile(file: File, bucket: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) {
    console.error(`❌ Storage upload error [${bucket}]:`, uploadError);
    return { data: null, error: `Failed to upload image to ${bucket}.` };
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (!urlData.publicUrl) {
    return { data: null, error: 'Failed to get public URL for the image.' };
  }

  return { data: { url: urlData.publicUrl, fileName }, error: null };
}

// ✅ Send new post email notifications
async function sendNewPostNotification(post: { id: string; title: string }) {
  const { EMAIL_USER, EMAIL_PASS, NEXT_PUBLIC_BASE_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in env.');
    return;
  }
  if (!NEXT_PUBLIC_BASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_BASE_URL in env.');
    return;
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: subscribers, error } = await supabaseAdmin
    .from('subscriptions')
    .select('email');

  if (error) {
    console.error('❌ Failed to fetch subscribers:', error);
    return;
  }
  if (!subscribers || subscribers.length === 0) {
    console.warn('⚠️ No subscribers found. No emails will be sent.');
    return;
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

  const postUrl = `${NEXT_PUBLIC_BASE_URL}/blog/${post.id}`;

  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: `New Blog Post: ${post.title}`,
        html: `
          <h1>New Post on Digital Indian Blog</h1>
          <p>We've just published "<strong>${post.title}</strong>".</p>
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
      console.log(`✅ Email sent to ${subscriber.email}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${subscriber.email}:`, err);
    }
  }

  console.log(`🎉 Finished sending notifications.`);
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

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: postData, error: dbError } = await supabaseAdmin
    .from('posts')
    .insert([{ title, content, author, category, image_url: uploadResult.url }])
    .select()
    .single();

  if (dbError) {
    console.error('❌ Database insert error:', dbError);
    return { message: 'Failed to save post to DB.' };
  }

  if (postData) {
    // ✅ This is now a non-blocking call
    sendNewPostNotification(postData);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return { message: '✅ Success! Post created.' };
}

// ✅ Delete post
export async function deletePost(id: string, imageUrl: string) {
  const supabaseAdmin = createSupabaseAdminClient();

  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    const { error: storageError } = await supabaseAdmin.storage.from('posts').remove([fileName]);
    if (storageError) console.error('❌ Storage deletion error:', storageError);
  }

  const { error: dbError } = await supabaseAdmin.from('posts').delete().match({ id });
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

  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin
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
