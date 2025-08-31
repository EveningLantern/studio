'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a Supabase client for server-side operations
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

export async function sendWelcomeEmail(email: string) {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('Email credentials are not set for sending welcome email.');
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

    const mailOptions = {
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to the Digital Indian Newsletter!',
        html: `
            <h1>Welcome!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll be the first to know about our latest articles, insights, and company news.</p>
            <p>Best regards,<br>The Digital Indian Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

const emailSchema = z.string().email({ message: "Please enter a valid email address." });

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return {
      message: validation.error.errors[0].message,
      status: 'error'
    };
  }
  
  const supabaseAdmin = createSupabaseServerClient();

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .insert({ email });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return {
        message: 'This email is already subscribed.',
        status: 'error'
      };
    }
    console.error('Subscription error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      status: 'error'
    };
  }

  // Send welcome email, but don't wait for it to complete
  sendWelcomeEmail(email);

  return {
    message: 'Thank you for subscribing!',
    status: 'success'
  };
}
