# 02 — UI / UX Guidelines

## 1. Visual direction
Use a modern SaaS admin dashboard aesthetic:
- Light mode only
- White page background
- Very light gray surfaces
- Dark navy / charcoal text
- Blue as the primary action color
- Subtle borders and restrained shadows
- Rounded cards, consistent spacing, clear hierarchy

Suggested design tokens:
```css
:root {
  --color-bg: #f7f8fc;
  --color-surface: #ffffff;
  --color-surface-muted: #f1f4f9;
  --color-text: #172033;
  --color-text-muted: #697386;
  --color-border: #e5e9f0;
  --color-primary: #3867e8;
  --color-primary-hover: #2854cc;
  --color-success: #15966b;
  --color-warning: #d98a16;
  --color-danger: #d64545;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-card: 0 4px 18px rgba(20, 35, 70, 0.06);
}
```

## 2. Main admin layout
Desktop:
- Fixed or sticky left sidebar, approximately 240px wide
- Main content fills remaining width
- Top header contains page title, search or quick action, and user menu
- Main content uses a 12-column grid or responsive CSS grid

Sidebar navigation:
1. Dashboard
2. Videos
3. Categories
4. Settings (optional)

Sidebar footer:
- User profile
- Logout action

Mobile:
- Collapse sidebar into a drawer or compact navigation
- KPI cards become one or two columns
- Charts stack vertically
- Video table becomes horizontally scrollable or responsive cards

## 3. Dashboard page
Header:
- Title: Dashboard
- Supporting text: Overview of your video library

KPI cards:
- Total Videos
- Total Views
- Storage Used

Each KPI card should have:
- Label
- Large numeric value
- Small icon or visual indicator
- Optional secondary context

Charts:
- Top 10 Videos: horizontal or vertical bar chart; use a horizontal bar chart if titles are long.
- Views Over Time: line chart with Day / Month segmented control.
- Tooltips should display formatted values.
- Chart containers should have a fixed minimum height and resize responsively.

## 4. Video list page
Header:
- Title: Videos
- Primary button: Add Video

Toolbar:
- Search input
- Category dropdown
- Sort dropdown

Table:
- Thumbnail preview (consistent 56×40 or 64×44 ratio)
- Title
- ID
- Views
- Actions

Action buttons:
- Edit: secondary or ghost button
- Delete: danger/outline button
- Use accessible text labels or tooltips; do not rely on icons alone.

Delete interaction:
- Confirmation modal includes the video title.
- Confirm and Cancel actions.
- Show toast after success or error.

## 5. Video form
Fields:
- Title (required)
- Description
- Thumbnail URL or image picker
- Video URL / source
- Category selector
- Tags selector
- File size (bytes or friendly display)
- Save and Cancel

Use clear inline validation. Preserve entered values if validation fails.

## 6. Authentication layout
Login, Register, and Forgot Password pages:
- Centered card on a light background
- Product name / simple logo area
- Clear page heading and supporting text
- Full-width primary submit button
- Links between Login, Register, and Forgot Password
- Password visibility toggle where relevant
- Visible local-demo notice

## 7. Components
Build reusable components:
- Sidebar
- Header
- KPI card
- Chart card
- Data table
- Search field
- Select field
- Modal
- Toast notification
- Empty state
- Pagination
- Form field

## 8. UX states
Every data-driven page must support:
- Initial loading
- No records
- No search results
- Validation error
- Database error
- Success feedback

## 9. Responsive breakpoints
Suggested:
- Mobile: <= 640px
- Tablet: 641px–1024px
- Desktop: > 1024px

Do not let the page overflow horizontally except for an intentionally scrollable data table.
