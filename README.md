# LegalAdvisor AI — frontend (Next.js)

LegalAdvisor AI (LawyerAI) is a Next.js web app for Vietnamese users: an AI legal assistant with streamed answers, a community Hub, a blog platform, lawyer verification, and an admin console. It talks to the **LawyerAI-api** backend for data, auth, RAG-backed chat, and moderation workflows.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![CI](https://img.shields.io/github/actions/workflow/status/lethanhdat1567/lawerAI-UI/ci.yml?branch=main&label=CI&logo=github)](https://github.com/lethanhdat1567/lawerAI-UI/actions) [![Vercel](https://img.shields.io/badge/Vercel-preview%20%26%20prod-informational?logo=vercel)](https://vercel.com/docs/deployments/git/vercel-for-github) [![License](https://img.shields.io/badge/license-private-lightgrey)](https://github.com/lethanhdat1567/lawerAI-UI)

**Backend API:** [github.com/lethanhdat1567/Lawer-api](https://github.com/lethanhdat1567/Lawer-api) — run it locally (default **http://localhost:4000**) or point the UI at your deployed origin via **`NEXT_PUBLIC_API_BASE_URL`**.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Key pages & routes](#key-pages--routes)
- [Component architecture](#component-architecture)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

## Prerequisites

| Requirement | Notes |
| --- | --- |
| Node.js | **≥ 20** (matches Next.js 15 and the backend). |
| npm | Comes with Node; CI uses `npm ci`. |
| Running API | Clone and run [**Lawer-api**](https://github.com/lethanhdat1567/Lawer-api) (see that repo’s README). |
| Env file | Copy [`.env.example`](./.env.example) to **`.env.local`** and set at least **`NEXT_PUBLIC_API_BASE_URL`**. |

## Quick start

Run these commands from a fresh clone (adjust the API path if your backend folder lives elsewhere).

```bash
git clone https://github.com/lethanhdat1567/lawerAI-UI.git
cd lawerAI-UI
cp .env.example .env.local
```

Edit **`.env.local`**: set **`NEXT_PUBLIC_API_BASE_URL`** to your API origin **without** a trailing slash (for example `http://localhost:4000` if the API uses the default port).

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. When the dev server is ready, the terminal shows Next.js ready on that URL.

## Environment variables

### API

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend REST origin; no trailing slash. ⚠️ Wrong or missing values break every API call and `getApiBaseUrl()` throws at runtime. | `http://localhost:4000` |

### Auth (Firebase)

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | For Google sign-in | Firebase web API key from the Firebase console. | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | For Google sign-in | Auth domain (usually `your-project.firebaseapp.com`). | `myapp.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | For Google sign-in | Firebase project id. | `my-legal-app` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | No | Optional; passed to `initializeApp` when set. | `myapp.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | No | Optional sender id for Firebase config. | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | No | Optional Firebase app id. | `1:123:web:abc` |
| `JWT_ACCESS_SECRET` | For `/admin` middleware | Must match the API **`JWT_ACCESS_SECRET`**; **`middleware.ts`** verifies the access cookie with **HS256**. ⚠️ If unset, `/admin` always redirects to login. | `same-as-api-access-secret` |
| `JWT_SECRET` | Alternative to `JWT_ACCESS_SECRET` | Use when the API signs access tokens with a single **`JWT_SECRET`** instead of split secrets. | `change-me` |

Google sign-in needs the first three Firebase variables; `isFirebaseConfigured()` stays false until they are set. Configure **`JWT_ACCESS_SECRET`** (or **`JWT_SECRET`**) in **`.env.local`** and on Vercel for production **`/admin`**.

### Feature flags

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| — | — | No feature-flag environment variables are read in this repository today. | — |

## Project structure

```text
LawerAI-UI/
├── public/                 # Static files (favicons, open graph images, etc.) served from `/`.
├── src/
│   ├── app/                # Next.js App Router: layouts, pages, route handlers, and route groups.
│   ├── components/         # Shared UI: shadcn-style primitives, layout chrome, Tiptap editor bundles, marketing blocks.
│   ├── lib/                # API base URL, auth helpers, Firebase client, parsers, and small shared utilities.
│   ├── services/           # Client modules that call the backend or encapsulate domain-side effects.
│   ├── stores/             # Zustand stores for client global state (e.g. auth-related UI).
│   └── middleware.ts       # Edge middleware protecting `/admin` with JWT role checks.
├── eslint.config.mjs       # ESLint flat config (Next.js core-web-vitals + TypeScript).
├── next.config.ts          # Next.js configuration.
├── package.json            # Scripts and dependencies.
├── postcss.config.mjs      # PostCSS pipeline for Tailwind v4.
├── tsconfig.json           # TypeScript project references and path alias `@/*` → `src/*`.
└── CONTRIBUTING.md         # Branching, commits, and PR expectations for contributors.
```

## Key pages & routes

| Path | Page / handler | Auth | Description |
| --- | --- | --- | --- |
| `/` | `src/app/(marketing)/page.tsx` | No | Marketing landing. |
| `/about` | `src/app/(marketing)/about/page.tsx` | No | About page. |
| `/terms` | `src/app/(marketing)/terms/page.tsx` | No | Terms of use. |
| `/privacy` | `src/app/(marketing)/privacy/page.tsx` | No | Privacy policy. |
| `/what-is-verified` | `src/app/(marketing)/what-is-verified/page.tsx` | No | Explains verified lawyer status. |
| `/contributors` | `src/app/(marketing)/contributors/page.tsx` | No | Contributors leaderboard (public). |
| `/users/[username]` | `src/app/(marketing)/users/[username]/page.tsx` | No | Public profile by username. |
| `/login` | `src/app/(auth)/login/page.tsx` | No | Login. |
| `/register` | `src/app/(auth)/register/page.tsx` | No | Registration. |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | No | Password reset request. |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | No | Password reset form (token from email). |
| `/verify-email` | `src/app/(auth)/verify-email/page.tsx` | No | Email verification callback. |
| `/profile` | `src/app/(marketing)/profile/page.tsx` | No | Profile shell (client guards as needed). |
| `/profile/verification` | `src/app/(marketing)/profile/verification/page.tsx` | No | Lawyer verification request UI. |
| `/blog` | `src/app/(marketing)/blog/page.tsx` | No | Blog index. |
| `/blog/[slug]` | `src/app/(marketing)/blog/[slug]/page.tsx` | No | Blog post detail. |
| `/blog/new` | `src/app/(marketing)/blog/new/page.tsx` | No | Create post (API enforces auth). |
| `/blog/edit/[id]` | `src/app/(marketing)/blog/edit/[id]/page.tsx` | No | Edit post (API enforces auth). |
| `/hub` | `src/app/(marketing)/hub/page.tsx` | No | Hub feed. |
| `/hub/[slug]` | `src/app/(marketing)/hub/[slug]/page.tsx` | No | Hub post detail. |
| `/hub/new` | `src/app/(marketing)/hub/new/page.tsx` | No | New hub post. |
| `/hub/edit/[id]` | `src/app/(marketing)/hub/edit/[id]/page.tsx` | No | Edit hub post. |
| `/my/blog` | `src/app/(marketing)/my/blog/page.tsx` | Yes (client) | Current user’s blog posts (`MyAuthGuard`). |
| `/my/blog/saved` | `src/app/(marketing)/my/blog/saved/page.tsx` | Yes (client) | Saved posts. |
| `/my/hub` | `src/app/(marketing)/my/hub/page.tsx` | Yes (client) | Current user’s hub posts. |
| `/assistant` | `src/app/(assistant)/assistant/page.tsx` | No | AI assistant (guest or logged-in; API accepts optional auth). |
| `/admin` | `src/app/(admin)/admin/page.tsx` | Yes (middleware) | Admin home; requires **ADMIN** JWT in cookie. |
| `/admin/ai-management` | `src/app/(admin)/admin/ai-management/page.tsx` | Yes (middleware) | AI prompt / config management. |
| `/admin/blog` | `src/app/(admin)/admin/blog/page.tsx` | Yes (middleware) | Blog moderation. |
| `/admin/blog-tags` | `src/app/(admin)/admin/blog-tags/page.tsx` | Yes (middleware) | Blog tags. |
| `/admin/blog-ideas` | `src/app/(admin)/admin/blog-ideas/page.tsx` | Yes (middleware) | Blog idea queue. |
| `/admin/hub` | `src/app/(admin)/admin/hub/page.tsx` | Yes (middleware) | Hub moderation. |
| `/admin/hub-categories` | `src/app/(admin)/admin/hub-categories/page.tsx` | Yes (middleware) | Hub categories. |
| `/admin/users` | `src/app/(admin)/admin/users/page.tsx` | Yes (middleware) | User admin. |
| `/admin/verifications` | `src/app/(admin)/admin/verifications/page.tsx` | Yes (middleware) | Lawyer verification queue. |
| `/admin/leaderboard` | `src/app/(admin)/admin/leaderboard/page.tsx` | Yes (middleware) | Admin leaderboard view. |
| `/admin/crawl` | `src/app/(admin)/admin/crawl/page.tsx` | Yes (middleware) | Crawl tooling. |
| `POST /api/auth/session` | `src/app/api/auth/session/route.ts` | No | Sets httpOnly auth cookies from tokens returned by the API. |
| `POST /api/auth/refresh` | `src/app/api/auth/refresh/route.ts` | No | Refreshes access token using refresh cookie. |

## Component architecture

The codebase favors **route-group folders** under `src/app/(marketing)`, `(auth)`, `(assistant)`, and `(admin)` so each surface keeps its own layouts and colocated `_components` where needed. Shared building blocks live under **`src/components/ui`** (buttons, dialogs, inputs aligned with shadcn/Radix patterns), **`src/components/layout`** for global chrome (header, footer, shells), and **`src/components/marketing`** for landing and promotional sections. The editor stack is grouped by responsibility: **`tiptap-templates`**, **`tiptap-node`**, **`tiptap-ui`**, and **`rich-text-editor`** mirror Tiptap’s template structure instead of a strict atomic-design taxonomy. **`src/lib`** holds framework-agnostic helpers (API URL, cookies, Firebase), while **`src/services`** holds modules that orchestrate HTTP calls to the backend.

## Scripts

| Script | Purpose | When to use |
| --- | --- | --- |
| `npm run dev` | `next dev --turbopack` | Local development with fast refresh. |
| `npm run build` | `next build --turbopack` | Production build (run before `start` or in CI). |
| `npm run start` | `next start -p 3001` | Serve the production build locally on port **3001**. |
| `npm run lint` | `next lint` | ESLint via Next.js (core-web-vitals + TypeScript rules). |
| `npm run type-check` | `tsc --noEmit` | Typecheck without emitting files (CI and pre-commit). |

## Troubleshooting

### API not reachable

Confirm **LawyerAI-api** is running and **`NEXT_PUBLIC_API_BASE_URL`** matches its origin (scheme, host, port, **no** trailing slash). Check browser devtools **Network** for failed fetches and CORS errors; the API must allow **`FRONTEND_URL`** (see backend `.env`).

### Firebase auth fails

Verify all required **`NEXT_PUBLIC_FIREBASE_*`** values match the Firebase console web app, with no extra quotes or spaces. Enable Google sign-in in Firebase Authentication and add your local / Vercel origins to authorized domains.

### Hydration errors

Compare server and client output for components that read **`window`**, **`localStorage`**, or random values during render. Prefer `useEffect` for browser-only APIs, or suppress only when using stable, documented patterns (see Next.js [hydration docs](https://nextjs.org/docs/messages/react-hydration-error)).

### Build fails on Vercel

Ensure all **`NEXT_PUBLIC_*`** and **`JWT_ACCESS_SECRET`** / **`JWT_SECRET`** variables are defined in the Vercel project settings. Run **`npm run build`** and **`npm run type-check`** locally first; increase log verbosity in the Vercel build output if a dependency or Edge/runtime limit fails.

---

## License

Private; add a `LICENSE` file if you intend to open-source the project.
