
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


// --- Company Updates Actions ---

// ✅ Add new update
export async function addUpdate(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('company_updates')
    .insert([{ title, content }]);

  if (error) {
    console.error('❌ Database insert error (updates):', error);
    return { message: 'Failed to save update to DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return { message: '✅ Success! Company update has been created. You can now notify subscribers.' };
}

// ✅ Delete update
export async function deleteUpdate(id: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('company_updates').delete().match({ id });
  if (error) {
    console.error('❌ DB deletion error (updates):', error);
    return { error: 'Failed to delete update from DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return { error: null };
}

// ✅ Update update
export async function updateUpdate(id: string, updateData: { title: string; content: string }) {
  const { title, content } = updateData;
  if (!title || !content) {
    return { error: 'Title and content are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('company_updates')
    .update({ title, content })
    .match({ id });

  if (error) {
    console.error('❌ DB update error (updates):', error);
    return { error: 'Failed to update company update.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/blog');

  return { error: null };
}

// ✅ Send new company update email notifications
export async function notifySubscribersOfUpdate(updateId: string, updateTitle: string) {
  const { EMAIL_USER, EMAIL_PASS, NEXT_PUBLIC_BASE_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in env.');
    return { success: false, message: 'Server email configuration is incomplete.' };
  }
  if (!NEXT_PUBLIC_BASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_BASE_URL in env.');
    return { success: false, message: 'Base URL is not configured.' };
  }

  const supabaseAdmin = createSupabaseAdminClient();
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

  console.log(`📢 Sending update notification to ${subscribers.length} subscribers...`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Since updates don't have their own page, link to the blog page
  const blogUrl = `${NEXT_PUBLIC_BASE_URL}/blog`;
  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: `Company Update: ${updateTitle}`,
        html: `
          <h1>A New Update from Digital Indian</h1>
          <p>We've just posted a new company update: "<strong>${updateTitle}</strong>".</p>
          <p>You can view this and all other news on our blog page.</p>
          <a href="${blogUrl}" 
             style="display:inline-block;padding:10px 20px;color:white;
                    background-color:#008080;text-decoration:none;
                    border-radius:5px;">
            View Updates
          </a>
          <br>
          <p>Best,<br>The Digital Indian Team</p>
        `,
      });
      sentCount++;
      console.log(`✅ Update email sent to ${subscriber.email}`);
    } catch (err) {
      failedCount++;
      console.error(`❌ Failed to send update email to ${subscriber.email}:`, err);
    }
  }

  console.log(`🎉 Finished sending update notifications. Sent: ${sentCount}, Failed: ${failedCount}`);
  return { success: true, message: `Notifications sent to ${sentCount} subscribers. ${failedCount > 0 ? `${failedCount} failed.` : ''}` };
}


// --- Job Opening Actions ---

// ✅ Add new job opening
export async function addJobOpening(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const type = formData.get('type') as string;
  const department = formData.get('department') as string;
  const description = formData.get('description') as string;

  if (!title || !location || !type || !department || !description) {
    return { message: 'All fields are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('job_openings')
    .insert([{ title, location, type, department, description }]);

  if (error) {
    console.error('❌ Database insert error (jobs):', error);
    return { message: 'Failed to save job opening to DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/career');

  return { message: '✅ Success! Job opening has been posted.' };
}

// ✅ Delete job opening
export async function deleteJobOpening(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('job_openings').delete().match({ id });

  if (error) {
    console.error('❌ DB deletion error (jobs):', error);
    return { error: 'Failed to delete job opening from DB.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/career');

  return { error: null };
}

// ✅ Update job opening
export async function updateJobOpening(id: string, jobData: { title: string; location: string; type: string; department: string; description: string; }) {
  const { title, location, type, department, description } = jobData;
  if (!title || !location || !type || !department || !description) {
    return { error: 'All fields are required.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('job_openings')
    .update({ title, location, type, department, description })
    .match({ id });

  if (error) {
    console.error('❌ DB update error (jobs):', error);
    return { error: 'Failed to update job opening.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/career');

  return { error: null };
}

// ✅ Send new job email notifications
export async function notifySubscribersOfJob(jobId: string, jobTitle: string) {
  const { EMAIL_USER, EMAIL_PASS, NEXT_PUBLIC_BASE_URL } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in env.');
    return { success: false, message: 'Server email configuration is incomplete.' };
  }
  if (!NEXT_PUBLIC_BASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_BASE_URL in env.');
    return { success: false, message: 'Base URL is not configured.' };
  }

  const supabaseAdmin = createSupabaseAdminClient();
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

  console.log(`💼 Sending job notification to ${subscribers.length} subscribers...`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const careerUrl = `${NEXT_PUBLIC_BASE_URL}/career`;
  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: `New Job Opportunity: ${jobTitle}`,
        html: `
          <h1>New Career Opportunity at Digital Indian</h1>
          <p>We have a new opening for the position of "<strong>${jobTitle}</strong>".</p>
          <p>If you or someone you know is interested, please visit our careers page to learn more and apply.</p>
          <a href="${careerUrl}" 
             style="display:inline-block;padding:10px 20px;color:white;
                    background-color:#10b981;text-decoration:none;
                    border-radius:5px;">
            View Careers
          </a>
          <br>
          <p>Best,<br>The Digital Indian Team</p>
        `,
      });
      sentCount++;
      console.log(`✅ Job notification email sent to ${subscriber.email}`);
    } catch (err) {
      failedCount++;
      console.error(`❌ Failed to send job email to ${subscriber.email}:`, err);
    }
  }

  console.log(`🎉 Finished sending job notifications. Sent: ${sentCount}, Failed: ${failedCount}`);
  return { success: true, message: `Notifications sent to ${sentCount} subscribers. ${failedCount > 0 ? `${failedCount} failed.` : ''}` };
}
