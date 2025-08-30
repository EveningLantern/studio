-- This script sets up the necessary Supabase tables, storage buckets, and policies
-- for the Digital Indian application.
--
-- To use this file:
-- 1. Go to your Supabase project dashboard.
-- 2. Navigate to the "SQL Editor" section.
-- 3. Click "New query".
-- 4. Copy and paste the content of this file into the editor.
-- 5. Click "RUN".

-- =================================================================
-- 1. GALLERY SETUP
-- =================================================================

-- Create the 'gallery' table to store image information.
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  hint text,
  image_url text NOT NULL,
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for the 'gallery' table.
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone for the 'gallery' table.
-- This policy allows anyone to view the gallery items.
CREATE POLICY "Allow public read access" ON public.gallery
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to perform all operations.
-- This policy allows users who are logged in to insert, update, and delete.
-- Note: You might want to restrict this further to specific admin roles in a real application.
CREATE POLICY "Allow all access for authenticated users" ON public.gallery
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create a storage bucket named 'gallery' for images.
-- The 'public' option makes all files in this bucket publicly accessible via a URL.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Define policies for the 'gallery' storage bucket.
-- Allow anyone to view (select) images in the gallery.
CREATE POLICY "Allow public read access to gallery images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'gallery');

-- Allow authenticated users (admins) to upload, update, and delete images.
CREATE POLICY "Allow authenticated write access to gallery images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'gallery')
  WITH CHECK (bucket_id = 'gallery');


-- =================================================================
-- 2. BLOG POSTS SETUP
-- =================================================================

-- Create the 'posts' table to store blog post information.
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    content text NOT NULL,
    author text NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for the 'posts' table.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone for the 'posts' table.
-- This policy allows anyone to view the blog posts.
CREATE POLICY "Allow public read access for posts" ON public.posts
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to perform all operations on posts.
CREATE POLICY "Allow all access for authenticated users on posts" ON public.posts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create a storage bucket named 'posts' for blog thumbnail images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('posts', 'posts', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Define policies for the 'posts' storage bucket.
-- Allow anyone to view (select) images in the posts bucket.
CREATE POLICY "Allow public read access to post images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'posts');

-- Allow authenticated users (admins) to upload, update, and delete post images.
CREATE POLICY "Allow authenticated write access to post images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'posts')
  WITH CHECK (bucket_id = 'posts');
