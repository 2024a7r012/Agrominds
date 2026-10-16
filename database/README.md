# AgroMinds Database Setup Guide (Supabase PostgreSQL)

This document provides step-by-step instructions for configuring the database for AgroMinds using Supabase.

---

## 1. Quick Setup via Supabase Web Console

1. Create a project at [https://supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Copy the entire contents of [`database/schema.sql`](./schema.sql) and paste it into the editor.
5. Click **Run** to execute the script.

---

## 2. Included Database Features

- **`user_profiles`**: Extends Supabase `auth.users` with farming preferences, acreage, crops, and region.
- **`conversations` & `messages`**: Multi-turn agricultural chat threads with context persistence.
- **`agricultural_records`**: Indexed repository of crops, pests, soil management, irrigation, and practices.
- **`payments`**: Audit log of Razorpay orders, transaction signatures, amount, and tier status.
- **Row Level Security (RLS)**: Enforced isolation ensuring users only access their personal conversations and orders.
- **Trigger `on_auth_user_created`**: Seamlessly initialises a `user_profiles` record on registration.

---

## 3. Environment Variables

Retrieve your API credentials from **Project Settings -> API** in the Supabase Dashboard:

- `SUPABASE_URL`: e.g. `https://xyzproject.supabase.co`
- `SUPABASE_ANON_KEY`: Safe for frontend client calls
- `SUPABASE_SERVICE_ROLE_KEY`: Reserved strictly for server-side management
- `SUPABASE_JWT_SECRET`: Used by Express backend for token verification

Set these keys in `backend/.env` and `frontend/.env`.

---

## 4. Local Development Fallback

If live Supabase credentials are not provided during local development, the AgroMinds backend and frontend automatically detect the unconfigured status and use an in-memory/simulated store with explicit user indicators.
