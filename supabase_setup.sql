-- This script sets up the necessary database tables and storage policies for the Digital Indian app.
-- To use this, navigate to the SQL Editor in your Supabase project dashboard and paste the entire contents of this file.

-- 1. Create the 'gallery' table
-- This table stores information about the images in your website's gallery.
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  hint TEXT,
  image_url TEXT NOT NULL
);

-- 2. Create the 'posts' table
-- This table stores your blog posts.
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  image_url TEXT
);

-- 3. Enable Row Level Security (RLS) on the new tables
-- This is a crucial security step. It ensures that your data is not publicly accessible by default.
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for the 'gallery' table
-- These policies define who can access or modify the data.
-- Allow public read access so visitors can see the gallery.
CREATE POLICY "Enable read access for all users on gallery" ON public.gallery
FOR SELECT USING (true);
-- Allow admin users (authenticated) to add, update, and delete gallery items.
CREATE POLICY "Enable insert for authenticated users on gallery" ON public.gallery
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users on gallery" ON public.gallery
FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users on gallery" ON public.gallery
FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Create policies for the 'posts' table
-- These policies define who can access or modify the data.
-- Allow public read access so visitors can read blog posts.
CREATE POLICY "Enable read access for all users on posts" ON public.posts
FOR SELECT USING (true);
-- Allow admin users (authenticated) to add, update, and delete posts.
CREATE POLICY "Enable insert for authenticated users on posts" ON public.posts
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users on posts" ON public.posts
FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users on posts" ON public.posts
FOR DELETE USING (auth.role() = 'authenticated');


-- 6. Create Storage Buckets
-- You must create two storage buckets named 'gallery' and 'posts' from the Supabase Dashboard.
-- Go to Storage -> Buckets -> Create bucket.
--   - Name the first bucket 'gallery' and allow all MIME types.
--   - Name the second bucket 'posts' and allow all MIME types.
-- After creating the buckets, run the policy commands below.

-- 7. Create storage policies for the 'gallery' bucket
-- These policies control who can upload, view, and delete files in your gallery storage.
CREATE POLICY "Public read access for gallery"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated insert for gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated update for gallery"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'gallery' );

CREATE POLICY "Allow authenticated delete for gallery"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'gallery' );

-- 8. Create storage policies for the 'posts' bucket
-- These policies control who can upload, view, and delete files in your posts storage.
CREATE POLICY "Public read access for posts"
ON storage.objects FOR SELECT
USING ( bucket_id = 'posts' );

CREATE POLICY "Allow authenticated insert for posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'posts' );

CREATE POLICY "Allow authenticated update for posts"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'posts' );

CREATE POLICY "Allow authenticated delete for posts"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'posts' );

