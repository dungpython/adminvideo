# 04 — Technical Architecture

## 1. Architecture overview
```text
Browser
  |
  +-- HTML pages
  |
  +-- CSS design system
  |
  +-- Vanilla JavaScript
        |
        +-- Page modules
        +-- UI components
        +-- Services
        |     +-- Auth service
        |     +-- Video service
        |     +-- Dashboard service
        |
        +-- Database manager
              |
              +-- SQLite WASM (sql.js)
              |
              +-- IndexedDB persistence
                    +-- users.db bytes
                    +-- videos.db bytes
                    +-- video_categories.db bytes
                    +-- video_tags.db bytes
                    +-- video_views.db bytes
```

## 2. Runtime constraints
- Serve the static project through VS Code Live Server or another static file server.
- Do not create server endpoints.
- Do not use `fetch()` to call a custom backend.
- External CDN usage is permitted for browser libraries, but local copies are preferable for offline reliability.
- SQLite WASM initialization may require correct WASM asset paths. Follow the selected `sql.js` distribution's documented setup.

## 3. Database manager contract
Create a central `DBManager` responsible for:
- Loading SQLite WASM once
- Opening named database instances
- Loading database bytes from IndexedDB
- Running schema initialization
- Executing parameterized SQL
- Exporting and persisting modified database bytes
- Importing / exporting database backups
- Handling quota and database errors

Suggested API:
```js
await DBManager.init();

const rows = DBManager.query('videos', sql, params);
const result = DBManager.run('videos', sql, params);
await DBManager.save('videos');

const backup = DBManager.exportDatabase('videos');
await DBManager.importDatabase('videos', fileBytes);
```
The API is illustrative. Implement consistent return types and error handling.

## 4. SQL safety
Use prepared statements / bound parameters for values. Never concatenate raw user input into SQL strings.

Example:
```js
const stmt = db.prepare(
  'SELECT id, title FROM videos WHERE title LIKE $search'
);
stmt.bind({ $search: `%${searchTerm}%` });
```
Validate table names and database keys against fixed allowlists; parameter binding does not secure arbitrary SQL identifiers.

## 5. Authentication flow
1. Register validates fields.
2. Check duplicate email.
3. Store a demo-only password verifier.
4. Login compares the entered password against the stored verifier.
5. Store session state in `sessionStorage` by default.
6. Protect admin pages with a client-side route guard.
7. Logout clears session state.

Do not call this production-grade authentication. Client-side code and local database data can be inspected or modified by the user. Forgot-password cannot send a real reset email without a trusted service.

## 6. File and thumbnail handling
MVP recommendation:
- Store thumbnail URL or a small image data URL.
- Store video URL and file metadata.
- Do not store large video blobs in SQLite by default.
- If implementing local file selection, inspect file type and size, handle storage quota failures, and explain that data remains in this browser profile.
- Never imply that a selected local file has been uploaded to a public hosting service.

## 7. Charts
Use Chart.js.
- Dashboard service returns plain arrays / objects.
- Page module maps service results to chart datasets.
- Destroy the previous chart instance before creating a replacement.
- Update chart data after CRUD operations.
- Format large values with locale-aware number formatting.

## 8. Error handling
Centralize errors:
- SQLite initialization error
- IndexedDB read/write error
- Storage quota exceeded
- Invalid form data
- Duplicate email
- Missing video/category/tag
- Import/export failure

Show user-friendly messages. Keep technical details in `console.error` during development.

## 9. Security and privacy limitations
- No server-side authorization.
- No secure password reset.
- No secure multi-user data isolation.
- Browser storage can be cleared by the user or browser.
- Do not use real production credentials or confidential videos.
- For production deployment, introduce a trusted backend and server-side authentication.
