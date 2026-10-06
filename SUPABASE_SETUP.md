# Supabase Setup Guide for CivicConnect

## Quick Fix for "Failed to fetch" Error

The "Failed to fetch" error occurs because your `.env` file contains placeholder values instead of real Supabase credentials.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: CivicConnect (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 4: Set Up Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL:
   - For development: `http://localhost:5173`
   - For production: your actual domain
3. Enable email confirmations if desired
4. Configure any additional auth providers (Google, GitHub, etc.) if needed

## Step 5: Test the Connection

1. Save your `.env` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try logging in - the "Failed to fetch" error should be resolved

## Database Schema (Optional)

If you want to store user profiles and civic issues, you can create tables:

```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'citizen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Civic issues table
CREATE TABLE civic_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  status TEXT DEFAULT 'open',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

- **Still getting "Failed to fetch"?** Check the browser console for detailed error messages
- **Invalid credentials?** Double-check your URL and anon key in the `.env` file
- **CORS errors?** Make sure your site URL is configured in Supabase Authentication settings

## Security Notes

- Never commit your `.env` file to version control
- The anon key is safe to use in client-side code
- For production, consider implementing Row Level Security (RLS) policies
