# Video Admin — Vibe Coding Project

## 1. Project objective
Build a light-mode video administration website using only:
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- SQLite through SQLite WASM (`sql.js`)
- IndexedDB for persistent browser-side storage

No application backend, server-side runtime, API server, PHP, Python server, or Node.js server.

> This is a browser-based prototype. Client-side authentication is not secure for production use. Do not store real passwords or sensitive personal data.

## 2. Main modules
1. Dashboard
2. Video List
3. Create / Edit Video
4. Login
5. Register
6. Forgot Password
7. Categories
8. Tags
9. Settings / local data management (optional utility page)

## 3. Required dashboard
- Total videos
- Total views
- Storage used
- Bar chart: Top 10 videos by views
- Line chart: views by day / month

## 4. Video list
Columns:
- ID
- Title
- Thumbnail
- Views
- Actions: Edit, Delete

Recommended additions:
- Search by title
- Filter by category
- Sort by views / newest / title
- Pagination
- Confirm before delete
- Empty and loading states

## 5. Database files
Logical SQLite databases:
- `users.db`
- `videos.db`
- `video_categories.db`
- `video_tags.db`
- `video_views.db`

Because browser persistence is isolated per origin, the application should load each logical database using SQLite WASM and persist its exported bytes in IndexedDB. Do not assume the browser can write directly to an arbitrary project folder.

## 6. Suggested project structure
```text
admin video/
├── index.html
├── login.html
├── register.html
├── forgot-password.html
├── videos.html
├── video-form.html
├── categories.html
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── js/
│   │   ├── app.js
│   │   ├── router.js
│   │   ├── auth.js
│   │   ├── database/
│   │   │   ├── sqlite.js
│   │   │   ├── db-manager.js
│   │   │   ├── users-db.js
│   │   │   ├── videos-db.js
│   │   │   ├── categories-db.js
│   │   │   ├── tags-db.js
│   │   │   └── views-db.js
│   │   ├── services/
│   │   │   ├── video-service.js
│   │   │   └── dashboard-service.js
│   │   ├── components/
│   │   │   ├── sidebar.js
│   │   │   ├── header.js
│   │   │   ├── modal.js
│   │   │   └── toast.js
│   │   └── pages/
│   │       ├── dashboard.js
│   │       ├── videos.js
│   │       ├── video-form.js
│   │       ├── login.js
│   │       ├── register.js
│   │       └── forgot-password.js
│   └── images/
├── database/
│   └── README.md
└── docs/
    ├── 01_PROJECT_REQUIREMENTS.md
    ├── 02_UI_UX_GUIDELINES.md
    ├── 03_DATABASE_DESIGN.md
    ├── 04_TECHNICAL_ARCHITECTURE.md
    ├── 05_FEATURE_SPECIFICATIONS.md
    ├── 06_IMPLEMENTATION_PLAN.md
    └── 07_AI_AGENT_RULES.md
```

## 7. Implementation order
Read `docs/07_AI_AGENT_RULES.md` first, then:
1. Requirements and architecture
2. Database design
3. UI / UX
4. Feature specifications
5. Implementation plan

Build in small milestones. Verify each milestone before moving on.

## 8. Definition of done
- All required pages render in light mode and are responsive.
- Video CRUD works against SQLite WASM.
- Data persists after page refresh using IndexedDB.
- Dashboard figures are calculated from database records.
- Charts update after video/view data changes.
- Authentication flow works as a local prototype and clearly communicates its limitations.
- No backend or server-side application code is introduced.
