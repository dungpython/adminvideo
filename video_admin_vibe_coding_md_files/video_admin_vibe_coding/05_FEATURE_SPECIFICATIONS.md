# 05 — Feature Specifications

## 1. Dashboard

### KPI cards
**Total Videos**
- Count active video records.
- Exclude deleted/inactive records.

**Total Views**
- Sum all view events, plus any documented manual baseline if implemented.

**Storage Used**
- Sum `file_size_bytes` for active videos.
- Format as B, KB, MB, or GB.
- Label as declared video file size.

### Top 10 videos chart
Query concept:
```sql
SELECT v.id, v.title, COUNT(vw.id) AS views
FROM videos v
LEFT JOIN video_views vw ON vw.video_id = v.id
WHERE v.status = 'active'
GROUP BY v.id, v.title
ORDER BY views DESC, v.id DESC
LIMIT 10;
```
Since databases are separate, this cross-database query cannot run directly against independent database instances. Fetch video rows and aggregate view events in the JavaScript dashboard service, or use a single database.

### Views over time
Day mode:
- Group events by `YYYY-MM-DD`.
Month mode:
- Group events by `YYYY-MM`.
- Sort chronologically.
- Fill missing dates/months with zero where the selected reporting range requires continuity.
- Provide a sensible default range, such as the last 30 days for Day and last 12 months for Month.

## 2. Video list

### Read
- Load active videos.
- Calculate each video's views.
- Render ID, title, thumbnail, views, and actions.

### Search
- Case-insensitive title search.
- Debounce input to avoid unnecessary rerenders.

### Filter
- Filter by category.
- Include an “All categories” option.

### Sort
- Newest first (default)
- Oldest first
- Title A–Z
- Views high to low
- Views low to high

### Pagination
- Default page size: 10
- Show current page and total pages.
- Reset to page 1 after changing search/filter/sort.

### Create
- Validate title.
- Save record.
- Persist database.
- Refresh list and dashboard.

### Edit
- Load existing values.
- Update `updated_at`.
- Persist database.
- Refresh list and dashboard.

### Delete
- Confirm using a modal.
- Remove video and associated views/tag mappings.
- Persist affected databases.
- Refresh list and dashboard.

## 3. Login
Fields:
- Email
- Password

Behavior:
- Required-field validation.
- Normalize email to lowercase.
- Compare against local demo account data.
- Show a generic invalid-credentials message.
- On success, save a minimal session marker in `sessionStorage` and navigate to Dashboard.

## 4. Register
Fields:
- Full name
- Email
- Password
- Confirm password

Behavior:
- Validate required fields and email format.
- Enforce a basic password length policy for demo consistency.
- Confirm passwords match.
- Reject duplicate email.
- Create local demo account.
- Navigate to Login or automatically sign in, consistently with the chosen UX.

## 5. Forgot Password
Behavior:
- Validate email format.
- Display: “This is a local demo. Password reset email is not available.”
- Do not reveal whether an account exists.
- Do not claim a reset email was sent.
- A demo-only reset option may be provided, clearly separated from a real reset workflow.

## 6. Categories
MVP:
- List categories
- Add category
- Rename category
- Delete category only when unused, or require reassignment of associated videos

## 7. Demo data
Seed sample records only on first initialization:
- 12–20 videos
- 4–6 categories
- 30–100 view events across recent dates
- Sample thumbnails using stable local assets or safe placeholder images

Do not reseed on every page load. Provide a “Reset demo data” action only in development/settings.

## 8. Acceptance tests
- Register with valid details.
- Duplicate email is rejected.
- Login succeeds with valid demo credentials.
- Invalid login is rejected.
- Forgot Password shows the correct demo limitation.
- Add a video and verify it appears in the list.
- Edit title and verify updated title.
- Delete video and verify associated data cleanup.
- Search, filter, sort, and paginate.
- Verify KPI totals against seeded database records.
- Verify Top 10 ranking.
- Toggle Day / Month and verify aggregation.
- Refresh page and verify persistence.
