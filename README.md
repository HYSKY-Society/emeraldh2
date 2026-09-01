# Emerald H2 — Admin Platform (Next.js rebuild)

A functional, modernized rebuild of the **Emerald H2 / Millennium Reign Energy** green-hydrogen
fueling-network admin console — the 19-module platform originally built by OgreLogic — reimplemented
as a single Next.js full-stack application with a real database, authentication, and seed data.

> Scope: **Admin console + API + database + auth** (all modules). The public marketing site and the
> driver mobile/PWA experience are intentionally out of scope for this build.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Data | Prisma ORM — **SQLite** for local dev (zero setup), Postgres-ready |
| Auth | Signed JWT session cookie (`jose`) + bcrypt, edge middleware guard |
| UI | Tailwind CSS, `lucide-react` icons, Archivo / IBM Plex type system |
| Mutations | React Server Actions (no separate REST layer needed) |

## Quick start

```bash
npm install
npm run setup     # prisma generate + db push + seed
npm run dev       # http://localhost:3000
```

Then sign in at `/login` with the admin account created by the database seed
(defined in [`prisma/seed.ts`](prisma/seed.ts)). **Set your own admin credentials
there before any real deployment** — do not ship the default.

### Useful scripts

| Script | What it does |
|--------|--------------|
| `npm run setup` | Generate client, create the SQLite DB, seed it |
| `npm run db:seed` | Re-run the seed |
| `npm run db:reset` | Wipe + recreate + reseed |
| `npm run build` / `npm start` | Production build & serve |

## Switching to Postgres (production)

1. In `prisma/schema.prisma`, change `datasource db { provider = "sqlite" }` → `"postgresql"`.
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Set a strong `AUTH_SECRET`.
4. `npx prisma migrate deploy` (or `db push`) and `npm run db:seed`.

The models were written to port cleanly (status/JSON fields are plain strings so nothing is SQLite-specific).

## Modules

**People** — Members (search, add, profile, activate/deactivate, delete), Approval queue.
**Content & CMS** — Homepage hero editor, Content pages, News & Media, Donations, Refer & Earn (referral leaderboard), Bulk Mailing (compose + templates).
**App & Booking** — Stations (list, add, dashboard with green/amber/red status, detail + bookings), Booking history (filter + pagination), Transactions, App Training screens, Safety Questions (the Level-1 quiz).
**Membership Portal** — Forum categories, Web Training, Fractional Ownership sign-ups, Car Waitlist, Car Financing Applications.
**Settings** — General (company, contacts, app links), Mail Setup (SMTP).

## Data model

See [`prisma/schema.prisma`](prisma/schema.prisma). Seed data ([`prisma/seed.ts`](prisma/seed.ts))
mirrors what the live console contained — the real 12 safety questions, the four Hill Fuel stations,
observed members and the sample car-financing application — plus generated fillers to ~35 members and
~32 bookings.

## Notes vs. the original

- Served over HTTPS-ready Next.js with a masked password field (the original ran over plain HTTP with a visible password field).
- Passwords are bcrypt-hashed; sessions are signed httpOnly JWTs.
- Email sending is **logged**, not delivered — wire an SMTP provider (Settings → Mail Setup) to send for real.
- Payment/booking data is seeded; no payment gateway is integrated.

Background/context for this rebuild — the founder's product walkthrough — is transcribed in
[`docs/founder-call-transcript.md`](docs/founder-call-transcript.md).
