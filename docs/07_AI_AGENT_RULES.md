# 07 — AI Coding Agent Rules

Read this file before generating or modifying project code.

## 1. Non-negotiable stack
Use only:
- HTML
- CSS
- Vanilla JavaScript
- SQLite WASM (`sql.js`)
- IndexedDB
- Chart.js for charts

Do not introduce:
- Backend / server-side code
- Node.js server or Express
- PHP or Python server
- Supabase or Firebase
- React, Vue, Angular, or other frontend frameworks
- A remote database or API

A static file server for local development is acceptable. It must not contain application business logic.

## 2. Read project documentation
Before implementation, read:
- `01_PROJECT_REQUIREMENTS.md`
- `02_UI_UX_GUIDELINES.md`
- `03_DATABASE_DESIGN.md`
- `04_TECHNICAL_ARCHITECTURE.md`
- `05_FEATURE_SPECIFICATIONS.md`
- `06_IMPLEMENTATION_PLAN.md`

If requirements conflict, ask the project owner instead of silently choosing.

## 3. Coding standards
- Use semantic HTML.
- Use CSS variables for design tokens.
- Use modular JavaScript files with clear responsibilities.
- Prefer `const`; use `let` only when reassignment is required.
- Use `async/await` for asynchronous operations.
- Use descriptive function and variable names.
- Avoid duplicated logic.
- Add comments for non-obvious logic, not every line.
- Do not use inline event-handler attributes.
- Avoid global variables; expose only deliberate application entry points.

## 4. Database rules
- Use SQLite WASM for SQL execution.
- Use IndexedDB to persist exported database bytes.
- Use parameterized SQL for all user-provided values.
- Do not concatenate raw input into SQL.
- Run schema migrations safely and idempotently.
- Do not reset or overwrite user data during normal initialization.
- Seed demo data only when the relevant database is empty and only once.
- Handle storage quota and persistence errors.
- Provide database backup export and restore/import.

## 5. Separate database warning
If using multiple SQLite database files, do not write cross-database JOIN statements as if they were one database connection. Aggregate data in JavaScript or attach databases explicitly if the chosen SQLite WASM build supports the required behavior.

For reliable foreign keys and transactions, recommend a single physical `video_admin.db` with separate tables. Do not change to this design without telling the project owner because they requested separate logical database files.

## 6. Security rules
- Treat all authentication as demo-only.
- Never claim local browser authentication is production-secure.
- Do not store real credentials.
- Do not claim a password reset email was sent.
- Do not expose secrets in JavaScript or HTML.
- Do not render untrusted user content with unsafe `innerHTML`.
- Use `textContent` or safe DOM methods for user-controlled text.

## 7. UI rules
- Light mode only.
- White / light gray surfaces.
- Consistent spacing, typography, borders, and button styles.
- Responsive desktop, tablet, and mobile layouts.
- Provide accessible labels, focus states, and keyboard support.
- Every action button must work.
- Include loading, empty, success, and error states.

## 8. Work process
- Implement one milestone at a time.
- Before editing, inspect the existing project structure.
- Do not overwrite working files unnecessarily.
- After editing, summarize changed files and explain how to test.
- If an error occurs, identify its root cause before applying a fix.
- Do not invent features that were not requested.
- Ask before adding dependencies or changing architecture.

## 9. First task prompt
After reading all documentation, start with **Milestone 1 only** from `06_IMPLEMENTATION_PLAN.md`.

Create the project structure, shared light-mode layout, sidebar, header, static Dashboard, and static Video List using mock data. Do not implement database, authentication, or CRUD yet.

At the end:
1. List files created.
2. Explain how to run with VS Code Live Server.
3. List what has and has not been implemented.
4. Confirm that the technology constraints were followed.
