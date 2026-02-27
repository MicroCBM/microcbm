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
A `.env.local` file must contain `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000`). Without a running backend API, auth pages still render and forms are interactive, but data-dependent pages will show errors.

### Caveats
- The build produces expected warnings about dynamic routes using `cookies` during static generation — these are harmless.
- There is a compile warning about `useFormContext` not exported from `react-hook-form` in `CheckboxCells.tsx` — this is a pre-existing issue.
- No automated test suite exists in this repo (no test framework configured).
- The RCA module stores data in browser `localStorage`, not via the backend API.
