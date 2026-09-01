# Deploying Emerald H2 to HYSKY's Vercel + Supabase

This moves the app from local SQLite to **Supabase Postgres**, hosted on **Vercel**.
Steps marked **[you]** need a HYSKY-owned account and take ~15 minutes total; once the
connection strings exist I can run the cutover (schema switch, migrate, seed) and verify.

---

## 1. Create the Supabase project **[you]**

1. Sign in to Supabase with the HYSKY account → **New project**.
2. Name it `emeraldh2`, pick a region near Dayton (e.g. `us-east-1`), set a strong DB password (save it).
3. Once it provisions, go to **Project Settings → Database → Connection string**. Copy two forms:
   - **Transaction pooler** (port `6543`) → this becomes `DATABASE_URL`
   - **Session / direct** (port `5432`) → this becomes `DIRECT_URL`
4. Send me both strings (or paste them into `.env`). They're project connection secrets — keep them out of git; `.env` is already gitignored.

## 2. Switch Prisma to Postgres **[me, once I have the strings]**

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // migrations use the direct (non-pooled) URL
}
```

Then:

```bash
npx prisma migrate deploy   # or: npx prisma db push
npm run db:seed             # loads the same seed data (members, stations, questions…)
```

I'll verify the app runs against Supabase before we point Vercel at it.

## 3. Deploy to Vercel **[you + me]**

1. Push this repo to a HYSKY GitHub repo (I can prep it; you own the remote).
2. In Vercel (HYSKY account) → **Add New → Project → Import** that repo.
3. Add Environment Variables (Production + Preview):
   - `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - (later, for push) `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
4. Build command is already `prisma generate && next build` (see `package.json`). Deploy.
5. **Custom domain:** in Vercel → Project → Domains, add **`emeraldh2.hysky.org`** and create the matching CNAME in HYSKY's DNS. Set `NEXT_PUBLIC_APP_URL=https://emeraldh2.hysky.org`.

That's it — the phone then hits `https://emeraldh2.hysky.org` (or the `*.vercel.app` URL before DNS propagates).

---

## Notes
- **Local dev keeps working on SQLite** until we flip the provider; the schema is written to port cleanly (no SQLite-only features).
- **Auth:** stays on the current custom JWT for the demo. Supabase Auth (owned, free, OAuth + reset) is the planned successor — no Clerk.
- **Migrations:** switching to Postgres, run `npx prisma migrate dev --name init` once to create the first migration, then `migrate deploy` in CI/Vercel.
- **What I need from you to host:** the two Supabase connection strings, and the GitHub repo + Vercel project created under HYSKY. Everything else I can do.
