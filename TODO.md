# TODO — Classroom Platform

## Foundation

- [x] Initialize Next.js App Router + TypeScript + Tailwind with package manager pinning.
- [x] Add `public/manus-routes.json` and keep it synchronized with source routes.
- [x] Add Arabic RTL root layout, typography tokens, semantic colors, focus styles, skip link, and reduced-motion support.
- [x] Configure TypeScript diagnostics and keep lint/typecheck/build runnable.
- [x] Add `.env.example` and server/client environment validation without secrets in source.

## Database and security

- [x] Create Supabase migrations for all required entities, enums, constraints, timestamps, and indexes.
- [x] Add RLS policies for teacher ownership, class membership, student self-access, published results, and audit access.
- [x] Add private Storage buckets and a private-submission object policy; quiz-import upload policy remains to be wired through the server route.
- [ ] Add seed fixtures for teacherA, teacherB, studentA, studentB, classA, and classB without production mock data.
- [ ] Add authorization and RLS tests for cross-class and cross-student access.

## Authentication and invitations

- [x] Implement Supabase phone/password signup and signin with normalized phone numbers.
- [ ] Do not allow the client to choose `role`; teacher signup is not public.
- [x] Implement invite token hashing, validation, expiration, usage limits, and race-safe capacity checks.
- [ ] Implement safe logout, password change/reset behavior, rate limiting, and non-enumerating errors.

## Classes and students

- [x] Teacher can create and view real classes, and open a class detail route.
- [x] Teacher can issue a secure invite link; revoke/rotate controls remain to be wired.
- [ ] Teacher can add, move, suspend, and reactivate students while preserving academic history.
- [x] Student sees only classes they belong to.

## Assignments and submissions

- [ ] Teacher can create, publish, edit, and archive assignments with required title and optional details.
- [ ] Student can see published assignments for their classes only.
- [ ] Validate PDF/JPG/JPEG/PNG, size, MIME, extension, generated storage paths, and idempotency server-side.
- [ ] Preserve submission versions and current-version state.
- [ ] Use private Storage and short-lived signed URLs after ownership/membership authorization.
- [ ] Teacher can review files, grade, add notes, publish/hide grades, and mark late manually.

## Quizzes

- [ ] Import one JSON file into one editable draft quiz with field/question-level errors.
- [ ] Support MCQ, True/False, and Essay with points and optional rubric/model answer.
- [ ] Add draft editor, add/delete/duplicate/reorder, preview, and publish controls.
- [ ] Create immutable quiz versions and bind attempts to their version.
- [ ] Implement server-side eligibility, timing, attempt limits, autosave, duplicate-submit protection, and answer-key protection.
- [ ] Implement objective grading and result publication rules.

## AI grading

- [ ] Add provider adapters for Gemini and Groq without hardcoded model IDs.
- [ ] Store provider secrets server-side and never expose or log full keys.
- [ ] Add provider connection test, model discovery/manual model ID fallback, capability display, and endpoint safety.
- [ ] Add `ai_grading_jobs` with idempotency, lease, bounded retry, timeout, and failure states.
- [ ] Send only the minimum essay grading context; validate structured output and score bounds.
- [ ] Require teacher review before publishing proposed essay grades.

## Reports and notifications

- [ ] Add teacher dashboard using real counts and recent activity.
- [ ] Add grades filters and safe paginated CSV export.
- [ ] Add class, assignment, and quiz reports without misleading averages.
- [ ] Add private in-app notifications with read/unread state and safe links.
- [ ] Add auditable grade changes, invite revocations, suspensions, and publish actions.

## Quality gates

- [x] Add unit tests for validation and route-manifest contracts with real assertions.
- [ ] Add integration, security, and E2E tests with real authenticated fixtures.
- [ ] Test 375px, 768px, 1280px, and 1920px layouts.
- [ ] Test keyboard navigation, accessible names, labels, error announcements, focus management, contrast, 200% zoom, and reduced motion.
- [x] Run lint, typecheck, build, route manifest validation, and Supabase security advisor review.
- [ ] Capture and review production-like performance baseline before checkpoint.
- [ ] Document assumptions, route map, architecture, security model, test report, and known limitations.

## Design engineering — approved editorial direction

- [x] Fix CSS cascade at its source: Tailwind utilities must control link colors, font sizes and text line-height without inline color patches; Arabic retains normal letter spacing and appropriate line boxes.
- [x] Deliver staged hero entry, pointer-driven product depth, scroll storytelling, animated progress, button press feedback and a pause control; motion must not hijack scrolling or block links, and reduced-motion/keyboard/no-JS paths retain visible content.
- [x] Review landing, login, register and invitation on 375/768/1280/1920 widths; check computed CTA contrast, overflow, fonts, focus, failed assets, animation pause and reduced motion. Authenticated workspaces receive source review only unless a real authorized account is available.
- [x] Remove cosmetic links without destinations and identify illustrative product data as a demo; do not claim unfinished workflows are live.
- [x] Make all workspace navigation destinations reachable on mobile and mark the current page accessibly; improve common button, form error and status styling.
- [x] Save evidence and a concise review report describing repaired and still-unverified behavior.

## Premium Google-inspired login

- [x] Redesign `/login` only as a quiet Material-inspired white wide card on a pale backdrop, with outlined readable Arabic fields, pill actions, clear focus and a mobile-friendly stack. Preserve Classroom identity, the existing field order/names, Supabase phone/password behavior, validation announcements, password toggle, autofill and invitation return paths. Do not add fake Google login, reset links, policies, or testimonials. Keep registration and the landing unchanged; show the existing provider-setup limitation clearly.

## Unified authentication design

- [x] Use the same reusable account frame and form styling for `/login` and `/register`: identical background, card, fonts, outline fields, focus/error states and pill actions. Preserve all four registration fields, password confirmation, existing Supabase submission behavior and safe invitation navigation. Responsive height must grow with the registration form rather than clip it. Landing and workspace pages remain unchanged.

## Egyptian Arabic voice throughout

- [x] Use natural friendly Egyptian Arabic throughout all existing UI pages, navigation, auth/invites, class controls, teacher/student workspaces, loading/error/empty states, validation, accessibility labels, metadata and custom 404. Use gentle situational humor without insults, mockery, profanity or jokes about security/errors/grades. Keep names/technical terms/user data and routes/schema/permissions unchanged; align shared actions and update text-dependent selectors/tests. Preserve explicit unfinished-feature and illustrative-data disclosures.
