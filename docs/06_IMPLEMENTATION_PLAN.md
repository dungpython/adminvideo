# 06 — Implementation Plan

Build the application in small, testable milestones. Do not generate the entire application in one step.

## Milestone 1 — Project foundation
Tasks:
- Create folder structure from `00_README.md`.
- Create HTML entry pages.
- Add CSS reset, design tokens, layout, and shared components.
- Implement sidebar, header, navigation, and responsive shell.
- Build static Dashboard and Video List layouts using mock data.

Acceptance:
- All main layouts render.
- Light theme is consistent.
- Navigation works.
- Responsive behavior is acceptable.

## Milestone 2 — SQLite and persistence
Tasks:
- Load SQLite WASM.
- Implement IndexedDB wrapper.
- Implement DBManager.
- Initialize schemas.
- Implement database import/export.
- Add seed data once.

Acceptance:
- Database initializes without errors.
- Data survives refresh.
- Exported `.db` files can be downloaded and re-imported.

## Milestone 3 — Video CRUD
Tasks:
- Implement list, create, edit, delete.
- Add search, filter, sorting, pagination.
- Add validation, confirmation modal, and toast notifications.

Acceptance:
- CRUD works against SQLite data.
- Related data is handled consistently.
- List updates without full page reload where practical.

## Milestone 4 — Dashboard analytics
Tasks:
- Implement KPI queries / aggregation.
- Implement Top 10 chart.
- Implement daily and monthly line chart.
- Add date range defaults and empty states.

Acceptance:
- KPI values match the underlying records.
- Charts update after data changes.
- Day / Month toggle works.

## Milestone 5 — Authentication prototype
Tasks:
- Implement Register, Login, Forgot Password.
- Implement client-side route guard.
- Implement logout.
- Add clear local-demo security notice.

Acceptance:
- Local prototype flow works.
- No false claim of secure authentication or real email delivery.

## Milestone 6 — Quality assurance
Tasks:
- Test empty, loading, and error states.
- Test mobile / tablet / desktop.
- Test browser refresh and database persistence.
- Test malformed inputs and duplicate records.
- Test storage quota failure handling.
- Remove console errors and unused code.

Acceptance:
- All acceptance tests in `05_FEATURE_SPECIFICATIONS.md` pass.

## Suggested working rhythm
For each milestone:
1. Ask the coding agent to implement only that milestone.
2. Review changed files.
3. Run the app using Live Server.
4. Test the acceptance criteria.
5. Fix issues before starting the next milestone.

Do not let the agent silently change the technology stack.
