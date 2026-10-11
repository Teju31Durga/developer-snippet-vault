# Developer Snippet Vault & AI Publisher

A modern full-stack Next.js application for securely storing developer code snippets. Google Gemini automatically generates 3–5 tags and a one-sentence plain-English summary whenever a snippet is saved or updated.

## Stack

- Next.js App Router + TypeScript
- Supabase PostgreSQL + Supabase Auth
- Google Gemini via `@google/genai`
- Tailwind CSS
- Vercel deployment

## 1. Install

```bash
npm install
```

## 2. Create Supabase project

1. Create a project at https://supabase.com
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Authentication → Providers, keep Email enabled.
5. Copy the Project URL and anon/publishable key.

## 3. Get Gemini API key

Create a Gemini API key in Google AI Studio and put it in `.env.local`.

## 4. Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

Never expose `GEMINI_API_KEY` with a `NEXT_PUBLIC_` prefix.

## 5. Run

```bash
npm run dev
```

Open http://localhost:3000

## 6. Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add the same environment variables in Vercel → Project Settings → Environment Variables.
4. Deploy.
5. In Supabase Authentication settings, add your deployed Vercel URL to the allowed site/redirect configuration if required by your auth settings.

## How the AI flow works

```text
User enters code
      ↓
Next.js Server Action
      ↓
Google Gemini API
      ↓
3–5 tags + 1 sentence summary
      ↓
Supabase PostgreSQL
      ↓
Private dashboard
```

## Security

Supabase Row Level Security ensures a signed-in user can only select, insert, update, and delete rows where `user_id = auth.uid()`.

The Gemini API key is used only on the server through a Server Action and is not sent to the browser.
