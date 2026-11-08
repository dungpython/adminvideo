# 01 — Project Requirements

## 1. Product summary
Create a browser-based admin dashboard for managing a personal video library. The interface must be clean, modern, light-mode, and usable on desktop and tablet.

## 2. Technology constraints
### Allowed
- HTML
- CSS
- Vanilla JavaScript
- SQLite WASM (`sql.js`) for SQL operations in the browser
- IndexedDB for persistence of SQLite database bytes
- Chart.js for charts (JavaScript library, loaded through CDN or local asset)

### Not allowed
- Backend services or server-side application code
- Node.js / Express server
- PHP, Python, Java, .NET server
- Supabase, Firebase, or other hosted backend/database services
- React, Vue, Angular, or other frontend frameworks unless the project owner later changes the constraint

A static development server such as VS Code Live Server may be used to serve files locally. It is not an application backend.

## 3. User roles
Initial scope: one local user account type, `admin`.
The role field is included to support future extension, but no complex role-management UI is required in MVP.

## 4. Pages and navigation
| Page | Purpose |
|---|---|
| Dashboard | Overview of video library and viewing statistics |
| List Videos | Search, filter, sort, view, edit, and delete videos |
| Add Video | Create a video record |
| Edit Video | Update an existing video record |
| Login | Local prototype sign-in |
| Register | Create a local prototype account |
| Forgot Password | Demonstration-only recovery flow |
| Categories | Manage video categories (MVP optional) |

## 5. Dashboard requirements
Display KPI cards:
- Total Videos: count of non-deleted video records
- Total Views: sum of recorded view counts
- Storage Used: sum of each video's `file_size_bytes`, formatted in KB / MB / GB

Charts:
1. Top 10 Videos — vertical bar chart, ranked by views descending.
2. Views Over Time — line chart with Day / Month toggle.
   - Day mode: aggregate view events by calendar date.
   - Month mode: aggregate view events by calendar month.
   - Use the user's local timezone consistently for display.
   - If there are no view events, show a helpful empty state rather than a misleading chart.

## 6. Video list requirements
Required columns:
- ID
- Title
- Thumbnail
- Views
- Actions

Required actions:
- Edit: opens the edit form for the selected video.
- Delete: asks for confirmation, then deletes the selected record and related view/tag associations as appropriate.

Recommended MVP controls:
- Search title
- Category filter
- Sort by newest, title, or views
- Pagination (default 10 records per page)
- Add Video button
- Empty state and no-results state

## 7. Video data
A video record should support:
- Title (required)
- Description
- Thumbnail URL or locally selected image
- Video source URL or local file metadata
- Category
- Tags
- View count, derived from view events where possible
- File size in bytes
- Created and updated timestamps

For a browser-only MVP, store file metadata and thumbnail references rather than promising robust video hosting. Large video blobs can exceed browser storage quotas. If local file import is implemented, check quota and handle errors.

## 8. Authentication pages
### Login
- Email
- Password
- Show / hide password
- Remember session (local prototype only)
- Validation and error messages

### Register
- Full name
- Email
- Password
- Confirm password
- Validate email format and password confirmation
- Prevent duplicate email addresses

### Forgot Password
- Email input
- Demonstration confirmation message
- Do not claim that an email was sent: without a backend or email service, real password reset cannot be performed.
- For local prototype, provide a clearly labelled demo-only reset mechanism or instruct the user to clear local data and recreate the account.

## 9. Non-functional requirements
- Responsive layout
- Accessible labels and keyboard focus states
- Consistent error, success, empty, and loading states
- No inline JavaScript event attributes such as `onclick`
- Use parameterized SQL statements
- Validate user input before database writes
- Avoid injecting user input with `innerHTML`; use `textContent` or safe DOM construction
- Keep code modular and readable
- No secrets or real credentials in source files

## 10. MVP acceptance criteria
- User can register and log in in the same browser profile.
- User can add, view, edit, search, filter, sort, and delete video records.
- Database changes survive refresh and browser restart when IndexedDB data remains available.
- Dashboard KPIs and charts reflect the database.
- User can switch line chart between day and month aggregation.
- UI works at desktop and mobile widths.
- UI clearly states that authentication is local/demo-only.
