# 🔮 ArcanaFlow: Multi-Tenant Setup Guide

## Prerequisites Completed ✅

The codebase is fully configured for multi-tenant SaaS operation. All authentication, settings, and user isolation features are implemented and ready to use.

## What You Need to Do

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a free account (if you don't have one)
3. Click "New Project"
4. Fill in:
   - **Name**: ArcanaFlow (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to you
5. Wait ~2 minutes for project creation

### 2. Get Your Supabase Credentials

Once your project is created:

1.  Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Database** in the left menu
5. Scroll down to **Connection String** → **URI**
6. Copy the connection string (it starts with `postgresql://`)
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - This becomes your `DATABASE_URL`

### 3. Generate Encryption Key

Open your terminal in the ArcanaFlow directory and run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64-character hex string) → `ENCRYPTION_KEY`

### 4. Create `.env.local` File

Create a file named `.env.local` in the root directory with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (PostgreSQL from Supabase)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres

# Encryption Key (generated above)
ENCRYPTION_KEY=your_64_character_hex_string_here

# n8n (if you have it)
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

### 5. Run Database Migration

```bash
npx prisma migrate dev --name init
```

This creates the `User`, `ShopSettings`, and `Order` tables in your Supabase database.

### 6. Enable Google OAuth (Optional)

If you want to enable "Sign in with Google":

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google**
3. Follow instructions to get Google OAuth credentials
4. Enter your **Client ID** and **Client Secret**
5. Add authorized redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

### 7. Start the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## Testing the Multi-Tenant System

### Test 1: User Registration
1. Go to `http://localhost:3000/register`
2. Create an account with email/password
3. Verify you're redirected to `/settings`

### Test 2: Shop Configuration
1. Fill in dummy Etsy credentials:
   - **Shop ID**: `TESTSHOP`
   - **Keystring**: `test_key_123`
   - **Shared Secret**: `test_secret_456`
2. Click "Save & Connect Shop"
3. Verify redirect to `/dashboard`
4. Check Supabase database:
   ```sql
   SELECT * FROM "ShopSettings";
   ```
   Verify the `etsyKeystring` and `etsySharedSecret` are encrypted (gibberish)

### Test 3: User Isolation
1. Create a second user account (different email)
2. Add different shop settings
3. Log in as User A → Check dashboard
4. Log out → Log in as User B → Check dashboard
5. Verify: User A sees only their data, User B sees only their data

### Test 4: Authentication Flow
1. Log  out
2. Try accessing `/dashboard` directly
3. Verify you're redirected to `/login`
4. Log in
5. Verify you're redirected back to `/dashboard`

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│          Browser (Supabase Auth)             │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Middleware (Route Protection)           │
│  - Checks authentication                     │
│  - Redirects unauthenticated users           │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         API Routes (Protected)               │
│  /api/orders   - Row-level filtering         │
│  /api/settings - Encrypted storage           │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Prisma ORM (Multi-Tenant Queries)       │
│  WHERE userId = currentUser.id               │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      Supabase PostgreSQL Database            │
│  Tables: User, ShopSettings, Order           │
└─────────────────────────────────────────────┘
```

## Security Features ✅

- **🔒 Encrypted API Keys**: All Etsy credentials encrypted with AES-256-GCM
- **👤 User Isolation**: Every query filtered by `userId`
- **🛡️ Route Protection**: Middleware blocks unauthenticated access
- **🔑 Session Management**: Secure cookie-based sessions via Supabase
- **🚫 No Cross-Tenant Access**: Users can never see other users' data

## Troubleshooting

### "Cannot find module @prisma/client"
```bash
npx prisma generate
```

### "Database connection failed"
- Check your `DATABASE_URL` in `.env.local`
- Verify database password is correct
- Make sure Supabase project is running

### "Unauthorized" errors
- Clear browser cookies
- Log out and log back in
- Check Supabase Auth settings

### Encryption errors
- Verify `ENCRYPTION_KEY` is exactly 64 characters (hex)
- Make sure the key doesn't change after data is encrypted

## Next Steps

Now that multi-tenant architecture is complete, you can:
- Connect real Etsy API (update `lib/etsy.ts`)
- Integrate n8n workflows for AI processing
- Add PDF generation for readings
- Deploy to production (Vercel + Supabase)

🎉 **Your multi-tenant SaaS platform is ready!**
