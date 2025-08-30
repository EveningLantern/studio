
'use server';

import { createSupabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

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

  const supabaseAdmin = createSupabaseAdmin();
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

  return {
    message: 'Thank you for subscribing!',
    status: 'success'
  };
}
