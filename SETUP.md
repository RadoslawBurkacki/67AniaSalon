# Ania's Salon — Setup Guide

## 1. Install Node.js

Download from: https://nodejs.org (choose "LTS" version)  
After install, restart your terminal.

## 2. Install dependencies

Open a terminal in this folder and run:
```
npm install
```

## 3. Set up Supabase (free)

1. Go to https://supabase.com and create a free account
2. Click "New Project" — give it a name like "ania-salon"
3. Wait for the project to be ready (~1 minute)
4. Go to **SQL Editor** → **New query**, paste the contents of `supabase/schema.sql` and click **Run**
5. Go to **Settings** → **API** and copy:
   - `Project URL`  
   - `anon public` key

## 4. Configure environment variables

Copy `.env.local.example` to `.env.local`:
```
copy .env.local.example .env.local
```
Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_EMAIL=your-admin-email@example.com
```

## 5. Create admin user in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your admin email and a strong password
4. That email/password is what you use to log in at `/admin/login`

## 6. Run the dev server

```
npm run dev
```

Open http://localhost:3000 in your browser.

## 7. Customise the site

| What to change | File |
|---|---|
| Owner name & bio | `src/components/About.tsx` |
| Services & prices | `src/lib/types.ts` |
| Phone, address, hours | `src/components/Contact.tsx` |
| Google Maps embed | `src/components/Contact.tsx` (replace the iframe src) |
| Gallery photos | `src/components/Gallery.tsx` (replace `src` URLs with your own) |
| Hero stats (500+ clients, etc.) | `src/components/Hero.tsx` |
| Social media links | `src/components/Footer.tsx` |
| Site title & description | `src/app/layout.tsx` |
| Currency symbol (£) | `src/lib/types.ts` |

## 8. Deploy to Vercel (free)

1. Create a free account at https://vercel.com
2. Connect your GitHub repo (or drag & drop this folder)
3. Add the environment variables in Vercel dashboard (same as `.env.local`)
4. Click Deploy — your site will be live in minutes!

## Gallery photos

Replace the Unsplash placeholder images with your own nail/massage photos:
- Upload to Supabase Storage (free), or
- Use Cloudinary free tier, or
- Just put JPG files in `public/images/` and reference them as `/images/your-photo.jpg`

## Opening hours / time slots

Edit time slots available for booking in `src/lib/types.ts` → `TIME_SLOTS` array.  
Edit opening hours shown on the site in `src/components/Contact.tsx` → `hours` array.

## Admin features

Visit `/admin` (linked quietly in the footer) to:
- See all bookings in **Calendar** or **List** view
- **Confirm** or **Cancel** any booking
- Stats: total, today, pending, confirmed

To block a day off (e.g. holiday), insert into the `blocked_slots` table in Supabase directly.
