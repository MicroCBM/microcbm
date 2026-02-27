# AGENTS.md

## Cursor Cloud specific instructions

### Overview
MicroCBM is a **Next.js 15** (App Router) frontend for a Condition-Based Maintenance platform. It is a single-service app — no backend, database, or Docker in this repo. All data comes from an external REST API at `NEXT_PUBLIC_API_URL`.

### Running the app
- `npm run dev` — starts the dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint
- See `package.json` for all scripts

### Environment
A `.env.local` file must contain:
- `NEXT_PUBLIC_API_URL` — backend API base URL (e.g. `[REDACTED]`)
- `SESSION_SECRET` — used for session management

Without a running backend API, auth pages still render and forms are interactive, but data-dependent pages will show errors. The backend on Render free tier may need 30-60s cold-start time on first request.

### SEO & Security
- All pages have per-page metadata with title template `"%s | MicroCBM"`.
- `robots.ts`, `sitemap.ts`, and `manifest.ts` are in `src/app/`.
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
- `X-Powered-By` header is disabled.

### Middleware
- All routes except `/auth/*` are protected by the middleware. Unauthenticated users are redirected to `/auth/login`.
- The matcher excludes static assets, API routes, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`.

### Caveats
- The build produces expected warnings about dynamic routes using `cookies` during static generation — these are harmless.
- There is a compile warning about `useFormContext` not exported from `react-hook-form` in `CheckboxCells.tsx` — this is a pre-existing issue.
- No automated test suite exists in this repo (no test framework configured).
- The RCA module stores data in browser `localStorage`, not via the backend API.
- Login requires OTP verification (6-digit code sent to email), so full end-to-end login requires access to the user's email inbox.
- Do NOT remove `"use server"` from `src/app/(home)/layout.tsx` — it affects how Next.js treats the page tree during build (removing it causes `useSearchParams()` Suspense boundary errors).
- Do NOT add `loading.tsx` to `src/app/(home)/` — it changes static analysis behavior and breaks the build for the same reason.
- Per-page metadata for `"use server"` pages is placed in companion `layout.tsx` files (since server action modules can only export async functions). For `(home)/page.tsx`, `generateMetadata()` is used instead.
