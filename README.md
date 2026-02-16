# SkillBridge Client

Frontend for the SkillBridge tutoring platform built with Next.js App Router.  
It supports role-based experiences for `ADMIN`, `TUTOR`, and `STUDENT`, including booking management, tutor profile flows, and admin controls.

## Features

- Role-based dashboards and navigation
- Authentication with Better Auth
- Tutor discovery and tutor booking flow
- Admin management for users, bookings, categories, and subjects
- Server-side data fetching with cookie-based session forwarding
- Dynamic table UIs with pagination

## Tech Stack

- `Next.js 16` (App Router, Turbopack)
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Radix UI` + custom UI components
- `@tanstack/react-table` and `@tanstack/react-form`
- `better-auth`
- `zod` + `@t3-oss/env-nextjs`

## Installation

```bash
pnpm install
```

## Run Locally

```bash
pnpm dev
```

## Role Dashboards

- Admin: `/admin-dashboard`
- Student: `/dashboard`
- Tutor: `/tutor-dashboard`

Protected dashboard routes are handled by role checks in `src/proxy.ts`.
