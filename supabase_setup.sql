
-- Gallery Table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    hint TEXT,
    image_url TEXT NOT NULL
);

-- Posts Table for Blog
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    category TEXT,
    image_url TEXT NOT NULL
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;


-- Storage Bucket for Gallery
-- The bucket 'gallery' needs to be created manually in the Supabase dashboard.
-- Policies for gallery bucket:
-- Allow public read access
CREATE POLICY "Allow public read access on gallery"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users full access on gallery"
ON storage.objects FOR ALL
USING ( auth.role() = 'authenticated' AND bucket_id = 'gallery' )
WITH CHECK ( auth.role() = 'authenticated' AND bucket_id = 'gallery' );


-- Storage Bucket for Posts (Blog Thumbnails)
-- The bucket 'posts' needs to be created manually in the Supabase dashboard.
-- Policies for posts bucket:
-- Allow public read access
CREATE POLICY "Allow public read access on posts"
ON storage.objects FOR SELECT
USING ( bucket_id = 'posts' );

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users full access on posts"
ON storage.objects FOR ALL
USING ( auth.role() = 'authenticated' AND bucket_id = 'posts' )
WITH CHECK ( auth.role() = 'authenticated' AND bucket_id = 'posts' );

-- Database Policies for RLS
-- Gallery Policies:
-- Allow public read access
CREATE POLICY "Allow public read access for gallery"
ON gallery FOR SELECT
USING ( true );

-- Allow admin users (authenticated role) to perform all actions
CREATE POLICY "Allow admin full access for gallery"
ON gallery FOR ALL
USING ( auth.role() = 'authenticated' )
WITH CHECK ( auth.role() = 'authenticated' );

-- Posts Policies:
-- Allow public read access
CREATE POLICY "Allow public read access for posts"
ON posts FOR SELECT
USING ( true );

-- Allow admin users (authenticated role) to perform all actions
CREATE POLICY "Allow admin full access for posts"
ON posts FOR ALL
USING ( auth.role() = 'authenticated' )
WITH CHECK ( auth.role() = 'authenticated' );

-- Subscriptions Policies:
-- Allow anonymous users to subscribe
CREATE POLICY "Allow public insert for subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (true);

-- Allow admin users to read subscriptions
CREATE POLICY "Allow admin read access for subscriptions"
ON subscriptions FOR SELECT
USING ( auth.role() = 'authenticated' );

