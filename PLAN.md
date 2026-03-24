# DSAA — Project Plan

**Data Structures and Algorithms Architects**
Club web app + gamified LeetCode tracker

---

## Overview

This project has two distinct parts delivered as a single Next.js application:

- **Part 1 — Public club site:** Announcements, meeting info, and a resource library. Visible to anyone, no login required.
- **Part 2 — Member tracker:** A private, gamified LeetCode submission tracker with a daily challenge, activity grid, and leaderboard. Requires authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + auto REST API) |
| Hosting | Vercel (auto-deploy on every `git push`) |
| Automation | Vercel cron job + LeetCode GraphQL API |

One repo. One deploy. No separate backend server.

---

## Database Schema

```sql
-- Core user profile (extends Supabase auth.users)
users (
  id          uuid PRIMARY KEY references auth.users,
  username    text UNIQUE NOT NULL,
  full_name   text,
  role        text DEFAULT 'member', -- 'member' | 'admin'
  created_at  timestamptz DEFAULT now()
)

-- Part 1: club content
announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  body        text NOT NULL,
  pinned      boolean DEFAULT false,
  posted_by   uuid references users(id),
  created_at  timestamptz DEFAULT now()
)

resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  url         text NOT NULL,
  description text,
  tag         text, -- 'Arrays' | 'Trees' | 'Graphs' | 'DP' | 'Strings' | etc.
  posted_by   uuid references users(id),
  created_at  timestamptz DEFAULT now()
)

-- Part 2: tracker
challenges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date UNIQUE NOT NULL, -- one per day
  title         text NOT NULL,
  difficulty    text NOT NULL, -- 'Easy' | 'Medium' | 'Hard'
  leetcode_url  text NOT NULL,
  notes         text, -- optional context from admin
  posted_by     uuid references users(id),
  created_at    timestamptz DEFAULT now()
)

submissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid references users(id),
  challenge_id  uuid references challenges(id),
  code          text NOT NULL,
  reflection    text NOT NULL,
  submitted_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, challenge_id) -- one submission per user per day
)
```

---

## Route Structure

```
/ (public)
├── /                        Homepage — club name, meeting time, join info
├── /announcements           Announcements feed
├── /resources               Resource library with tag filter
└── /login                   Magic link login page

/dashboard (auth required)
├── /dashboard               Today's challenge + submission form
├── /dashboard/history       Member's past submissions
├── /leaderboard             Rankings by points + streak
└── /profile/[username]      Member profile — activity grid + stats

/admin (admin role required)
├── /admin/announcements     Post / manage announcements
├── /admin/resources         Add / manage resources
├── /admin/challenge         Post today's challenge (or override auto-post)
└── /admin/submissions       View all member submissions for today
```

---

## Part 1 — Public Club Site

### Goals
- Any visitor can see who DSAA is, when we meet, and what resources we have
- Admin can post announcements and resources in under a minute
- No login required to browse

### Pages

**Homepage `/`**
- Club name, tagline, meeting time card
- Link to Discord or group chat
- CTA to log in / join

**Announcements `/announcements`**
- Cards sorted by `created_at` DESC
- Pinned announcements appear first with a "Pinned" badge
- Fetch from `announcements` table (public read)

**Resources `/resources`**
- Cards with title, description, tag badge, external link
- Filter by tag (Arrays, Trees, DP, etc.)
- Fetch from `resources` table (public read)

**Admin forms**
- `/admin/announcements` — title, body, pin toggle → insert to `announcements`
- `/admin/resources` — title, URL, description, tag → insert to `resources`

### Completion gate
A non-member can visit the site and browse content. Admin can post new announcements and resources without touching the database directly.

---

## Part 2 — Member Tracker

### Goals
- Members log in and see one challenge per day
- Submit code + reflection after solving on LeetCode
- See their own activity grid (GitHub-style) fill up over time
- Compete on a leaderboard via points and streaks
- Admin can post challenges manually or let the cron job do it

### Points System

| Difficulty | Points |
|---|---|
| Easy | 1 pt |
| Medium | 2 pts |
| Hard | 3 pts |

Streak = consecutive days with at least one submission. Resets on a missed day.

### Pages

**Dashboard `/dashboard`**
- Today's challenge card: title, difficulty badge, link to LeetCode, optional admin notes
- Submission form: code textarea + reflection textarea + submit button
- Shows "Already submitted today" state if submission exists for `(user_id, today's challenge_id)`
- If no challenge posted yet: empty state — "No challenge posted yet today"

**Submission logic**
- On submit: POST to `/api/submissions`
- API route validates auth, checks no duplicate exists, inserts to `submissions`
- Unique constraint on `(user_id, challenge_id)` enforced at DB level as backup

**History `/dashboard/history`**
- Member's own submissions ordered by date DESC
- Each card: date, problem title, difficulty, their code (collapsed), their reflection

**Activity grid (on profile page)**
- 52 columns × 7 rows — one cell per day of the year
- Cell color by difficulty of that day's submission:
  - No submission → gray
  - Easy → light green (`#C0DD97`)
  - Medium → medium green (`#639922`)
  - Hard → dark green (`#27500A`)
- Hover shows date + problem title
- Data: query `submissions` joined to `challenges` filtered by `user_id`

**Leaderboard `/leaderboard`**
- Table: Rank | Name | Points | Streak | Total Solved
- Points = SUM of difficulty weights across all submissions
- Streak = computed from consecutive days in submissions
- Sorted by points DESC, streak as tiebreaker
- Single SQL query with aggregation — no caching needed at this scale

**Profile `/profile/[username]`**
- Activity grid (above)
- Stat cards: Total Solved, Current Streak, Total Points, Member Since
- Recent 5 submissions list

**Admin: challenge management `/admin/challenge`**
- Form: date (defaults to today), title, difficulty, LeetCode URL, optional notes
- Can override an auto-posted challenge
- Table of past challenges below

**Admin: submissions view `/admin/submissions`**
- Dropdown to select date (defaults to today)
- Table of all members who submitted, with their reflection visible
- Shows who has NOT submitted yet (all members minus submitters)

### Completion gate
Members can log in, see a daily challenge, submit code + reflection, view their activity grid, and see themselves on the leaderboard.

---

## Phase Checklist

### Phase 0 — Scaffolding
- [ ] `create-next-app` with TypeScript, Tailwind, App Router
- [ ] Supabase project created, env vars in `.env.local`
- [ ] `@supabase/ssr` installed, `lib/supabase/client.ts` + `server.ts` created
- [ ] `npx shadcn@latest init` — Button, Card, Input, Badge, Table added
- [ ] GitHub repo connected, initial commit pushed
- [ ] Vercel project linked to GitHub repo, auto-deploys enabled
- [ ] All DB tables created in Supabase SQL editor
- [ ] RLS enabled on all tables

### Phase 1 — Auth + Roles
- [ ] Supabase email (magic link) auth enabled
- [ ] `/login` page built
- [ ] `users` table populated on first login via auth trigger
- [ ] `role` column working — admin set manually in Supabase dashboard
- [ ] `middleware.ts` guards `/dashboard` and `/admin` routes
- [ ] RLS policies written for all tables
- [ ] `useUser()` hook available app-wide

### Phase 2 — Public Site
- [ ] Homepage live
- [ ] Announcements page fetching from DB
- [ ] Resources page with tag filter
- [ ] Admin: post announcements
- [ ] Admin: add resources
- [ ] Shared navbar with auth-aware state

### Phase 3 — Daily Challenge + Submission
- [ ] Admin challenge post form working
- [ ] Dashboard shows today's challenge
- [ ] Submission form posts to `/api/submissions`
- [ ] Duplicate submission prevention working
- [ ] Submission history page

### Phase 4 — Activity Grid + Leaderboard
- [ ] Activity grid component built
- [ ] Streak computation working
- [ ] Points calculation working
- [ ] Leaderboard page with rankings
- [ ] Profile page with grid + stats
- [ ] Admin submissions view

### Phase 5 — Automation + Polish
- [ ] Vercel cron job hits `/api/cron/daily-challenge` at midnight
- [ ] LeetCode GraphQL (`activeDailyCodingChallengeQuestion`) integration
- [ ] Email notifications via Supabase Edge Functions + Resend
- [ ] Member invite flow
- [ ] Mobile responsive audit
- [ ] Loading skeletons + empty states
- [ ] Custom domain connected

---

## AI Agent Instructions

When working on this project with an AI agent, provide this file as context and reference the relevant phase and section. Each phase has a gate condition — the phase is not complete until the gate is met.

Useful context to include per session:
- Current phase you're working on
- The gate condition for that phase
- Any specific component or route from the route structure above

The database schema is the source of truth for all data shapes. Do not deviate from column names or table structure without updating this file.
