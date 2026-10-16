# TheJason Studios CMS starter

Next.js + Supabase email/password auth, PostgreSQL projects table, storage for portfolio images, and Vercel deployment support.

## Setup
1. Create a Supabase project at https://database.new.
2. In Supabase Authentication > Users, create your owner user with email and a strong password. Copy its UUID.
3. Open `supabase/setup.sql`, replace every `OWNER_AUTH_USER_UUID` with that exact UUID (keep single quotes around it), then run the SQL in Supabase SQL Editor.
4. Copy the project URL and publishable key from Supabase Project Settings/API.
5. Copy `.env.example` to `.env.local` and fill in those values. Do not use a service-role/secret key.
6. Install Node.js LTS, then run `npm install` and `npm run dev`. Public site is `/`; owner panel is `/admin`.
7. Push this folder to a Git repository you control and import it into Vercel as a Next.js project. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` under Vercel Project Settings > Environment Variables, then redeploy.
8. Set the Supabase Auth Site URL to your live Vercel URL.

The SQL UUID is the actual security boundary for create/update/delete. Replace the placeholder before running the SQL. Do not enable public sign-ups or expose a service-role key. Existing static sample projects are not migrated automatically; add your own from `/admin`.

Docs: https://supabase.com/docs/guides/auth/quickstarts/nextjs and https://vercel.com/docs/environment-variables
