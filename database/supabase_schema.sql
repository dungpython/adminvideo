-- ==========================================================================
-- Supabase Schema — Video Admin
-- Project: vycirvbnpqtyargapwnt
-- Dashboard SQL Editor:
--   https://supabase.com/dashboard/project/vycirvbnpqtyargapwnt/sql/new
--
-- ⚠️ Run this ENTIRE script once in the SQL Editor before using the app.
-- ==========================================================================

-- -------------------------------------------------------------------------
-- 1. TABLE: users
-- Stores admin and regular user accounts. Used by the Permission Management module.
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id          BIGSERIAL    PRIMARY KEY,
  name        TEXT         NOT NULL,
  email       TEXT         NOT NULL UNIQUE,
  role        TEXT         NOT NULL DEFAULT 'USER'
                           CHECK (role IN ('ADMIN', 'USER')),
  status      TEXT         NOT NULL DEFAULT 'active',
  avatar      TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Row Level Security — allow all operations from anonymous (publishable) key
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_users" ON public.users;
CREATE POLICY "public_access_users"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);

-- Seed: 1 Admin + 10 Users
INSERT INTO public.users (id, name, email, role, status, avatar) VALUES
  (1,  'Admin Administrator', 'admin@example.com', 'ADMIN', 'active', 'A'),
  (2,  'Nguyen Van An',       'user1@demo.com',    'USER',  'active', 'N'),
  (3,  'Tran Thi Binh',       'user2@demo.com',    'USER',  'active', 'T'),
  (4,  'Le Hoang Cuong',      'user3@demo.com',    'USER',  'active', 'L'),
  (5,  'Pham Minh Dung',      'user4@demo.com',    'USER',  'active', 'P'),
  (6,  'Hoang Thu Giang',     'user5@demo.com',    'USER',  'active', 'H'),
  (7,  'Vu Duc Hai',          'user6@demo.com',    'USER',  'active', 'V'),
  (8,  'Doan Mai Khanh',      'user7@demo.com',    'USER',  'active', 'D'),
  (9,  'Bui Quang Linh',      'user8@demo.com',    'USER',  'active', 'B'),
  (10, 'Ngo Phuong Nga',      'user9@demo.com',    'USER',  'active', 'N'),
  (11, 'Dang Tuan Phong',     'user10@demo.com',   'USER',  'active', 'D')
ON CONFLICT (email) DO NOTHING;

-- Sync sequence after manual inserts
SELECT setval(
  pg_get_serial_sequence('public.users', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.users)
);

-- -------------------------------------------------------------------------
-- 2. TABLE: videos
-- Stores video library records.
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.videos (
  id               BIGSERIAL    PRIMARY KEY,
  title            TEXT         NOT NULL,
  description      TEXT,
  thumbnail_url    TEXT,
  video_url        TEXT,
  file_name        TEXT,
  file_size_bytes  BIGINT       NOT NULL DEFAULT 0,
  category_id      INTEGER,
  category_name    TEXT,
  tags             TEXT[],
  views            BIGINT       NOT NULL DEFAULT 0,
  status           TEXT         NOT NULL DEFAULT 'active',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_videos" ON public.videos;
CREATE POLICY "public_access_videos"
  ON public.videos FOR ALL
  USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 3. TABLE: video_categories
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_categories (
  id          BIGSERIAL    PRIMARY KEY,
  name        TEXT         NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_categories" ON public.video_categories;
CREATE POLICY "public_access_categories"
  ON public.video_categories FOR ALL
  USING (true) WITH CHECK (true);

-- Seed sample categories
INSERT INTO public.video_categories (name, description) VALUES
  ('Tutorials',       'Step-by-step programming and tech guides'),
  ('Vlogs',           'Weekly updates and behind the scenes'),
  ('Gaming',          'Gameplay highlights and walkthroughs'),
  ('Product Reviews', 'Hardware and gadget hands-on reviews'),
  ('Podcasts',        'Tech conversations and interviews')
ON CONFLICT (name) DO NOTHING;

-- -------------------------------------------------------------------------
-- 4. TABLE: video_views
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_views (
  id         BIGSERIAL    PRIMARY KEY,
  video_id   BIGINT       NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  source     TEXT
);

ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_access_views" ON public.video_views;
CREATE POLICY "public_access_views"
  ON public.video_views FOR ALL
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_video_views_video_id  ON public.video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON public.video_views(viewed_at);
