This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## for the bookmarks feature 
-- Create the bookmarks table
CREATE TABLE public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, companion_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (auth.uid()::text = user_id);



    -- Drop the existing table if it exists
DROP TABLE IF EXISTS public.bookmarks;

-- Create the bookmarks table with TEXT type for user_id
CREATE TABLE public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, companion_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Create policy to allow users to view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks
    FOR SELECT
    USING (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks
    FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks
    FOR DELETE
    USING (user_id = current_setting('request.jwt.claims')::json->>'sub');