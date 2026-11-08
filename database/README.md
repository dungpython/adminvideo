# Database Architecture

This directory is designated for SQLite database files and documentation.

## Browser-Based Storage Overview

Because this project runs entirely inside the browser without a backend or server-side runtime:
1. **SQLite WASM (`sql.js`)** executes SQL queries directly in the client browser.
2. **IndexedDB** (`video_admin_storage`) persistently saves the exported binary bytes of each database.
3. The browser cannot directly modify files in the host filesystem's `database/` folder during normal runtime.

## Logical Databases
- `users.db`: User accounts and credentials (local prototype only)
- `videos.db`: Video records, metadata, and references
- `video_categories.db`: Video categories
- `video_tags.db`: Video tags and mapping table
- `video_views.db`: Video view events and analytics

## Cloud Backend (Supabase)
The application also connects to Supabase Cloud:
- **Project URL:** `https://vycirvbnpqtyargapwnt.supabase.co`
- **Client Module:** `assets/js/database/supabase-client.js`
- **SQL Schema Script:** `database/supabase_schema.sql` (Tables: `users`, `videos`)
- Supports bi-directional sync and offline fallback to client storage.
