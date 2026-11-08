# 03 — Database Design

## 1. Browser storage architecture
Use SQLite WASM (`sql.js`) to execute SQL in the browser. Persist each database's exported binary bytes in IndexedDB.

Important distinction:
- `users.db`, `videos.db`, etc. are logical SQLite database files.
- A normal browser page cannot silently write these files into the project's `database/` folder.
- IndexedDB is the durable browser storage layer.
- Optional import/export controls may let the user download or upload `.db` backup files.

Use one IndexedDB database named `video_admin_storage` with object store `sqlite_files`. Store entries using keys such as:
- `users.db`
- `videos.db`
- `video_categories.db`
- `video_tags.db`
- `video_views.db`

## 2. Database files and tables

### 2.1 users.db
Table: `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
Prototype warning: a browser-only app cannot provide secure authentication. A client-side hash is not equivalent to server-side password security. Use fake/demo credentials only.

### 2.2 videos.db
Table: `videos`
```sql
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  file_name TEXT,
  file_size_bytes INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_videos_title ON videos(title);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
```
SQLite database files are separate. A foreign key from `videos.category_id` to a table in another `.db` file cannot be declared as a normal cross-database foreign key. Enforce cross-database references in the JavaScript service layer, or use a single SQLite database with multiple tables if referential integrity is more important.

### 2.3 video_categories.db
Table: `video_categories`
```sql
CREATE TABLE IF NOT EXISTS video_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 video_tags.db
Tables: `video_tags`, `video_tag_map`
```sql
CREATE TABLE IF NOT EXISTS video_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE
);

CREATE TABLE IF NOT EXISTS video_tag_map (
  video_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (video_id, tag_id)
);
```
Because this is a separate database, validate video and tag IDs in application code.

### 2.5 video_views.db
Table: `video_views`
```sql
CREATE TABLE IF NOT EXISTS video_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER NOT NULL,
  viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source TEXT
);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON video_views(viewed_at);
```

## 3. View count source of truth
Preferred design: `video_views` is the source of truth. Calculate views using:
```sql
SELECT video_id, COUNT(*) AS views
FROM video_views
GROUP BY video_id;
```
If users need to seed demo data or manually set view totals, either:
- add a `manual_view_offset` column to `videos`, or
- store an `initial_views` value and calculate `initial_views + event_count`.

Do not maintain two independently editable view totals without a clear reconciliation rule.

## 4. Storage calculation
Dashboard storage used:
```sql
SELECT COALESCE(SUM(file_size_bytes), 0) AS total_bytes
FROM videos
WHERE status = 'active';
```
This is the sum of declared video file sizes, not necessarily the physical browser storage consumed by thumbnails, database files, or cached assets. Label it clearly as “Video file size” or “Declared video storage”.

## 5. Database initialization
On first launch:
1. Initialize SQLite WASM.
2. Open IndexedDB.
3. For each logical database, load saved bytes if present.
4. If missing, create a new SQLite database and run its schema.
5. Persist initialized database bytes to IndexedDB.
6. Expose database methods through a central database manager.

## 6. Cross-database operations
For deleting a video:
1. Delete its row from `videos.db`.
2. Delete related view events from `video_views.db`.
3. Delete related tag mappings from `video_tags.db`.
4. Persist all modified databases.

Since there is no multi-database transaction, implement best-effort rollback or a cleanup/reconciliation routine. For a simpler and more reliable MVP, prefer one SQLite file with separate tables. If separate `.db` files are a firm requirement, document the lack of cross-file atomic transactions.

## 7. Recommended alternative
For stronger referential integrity and simpler backups, use one physical SQLite database named `video_admin.db` containing all tables. The UI can still present logical modules called Users, Videos, Categories, Tags, and Views.

If separate files are mandatory, implement the five-file approach above and enforce relationships in JavaScript.
